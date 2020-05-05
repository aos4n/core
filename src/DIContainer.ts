import { ScheduleRule } from './Alias';
import { Component, Config, StartUp, Test } from './Component';
import { InnerCachable } from './InnerCache';
import { Utils } from './Utils';

import schedule = require('node-schedule');
schedule.scheduleJob('', function () { })

/**
 * aos4n管理组件生命周期的容器，全局只会有一个实例
 */
export class DIContainer {
    readonly startTime: number

    private componentSet: Set<(new (...args: any[]) => {})> = new Set()
    private componentInstanceMap: Map<any, any> = new Map()

    constructor() {
        this.startTime = Date.now()
        this.setComponentInstance(DIContainer, this)
    }

    /**
     * 将已经实例化好的对象添加进容器
     * @param target 类型
     * @param instance 实例
     */
    setComponentInstance<T>(target: new (...args: any[]) => T, instance: T) {
        this.componentInstanceMap.set(target, instance)
    }

    /**
     * 以同步的方式根据指定类型从容器取出实例，需要确保此时类实例已经存在
     * @param target 类型
     */
    getComponentInstance<T>(target: new (...args: any[]) => T): T {
        return this.componentInstanceMap.get(target)
    }

    /**
     * 从工厂获取指定类型的组件实例，如果此组件类型没有一个可用实例，会创建一个实例然后返回给调用者
     * 这是一个异步方法，不能在构造器中起作用，所以请仅仅在程序启动的时候使用此方法
     * 程序运行中获取实例应该使用同步方法getComponentInstance
     * @param target 组件类型
     */
    async getComponentInstanceFromFactory<T>(target: new (...args: any[]) => T): Promise<T> {
        let instance = this.componentInstanceMap.get(target)
        if (instance) {
            return await instance
        }

        let instancePromise = this.createComponentInstance(target)

        return instancePromise
    }

    private async createComponentInstance<T>(target: new (...args: any[]) => T): Promise<T> {
        if (!Reflect.getMetadata(Component, target.prototype)) {
            throw new Error(`${target.name}没有被注册为可自动解析的组件，请至少添加@Component、@StartUp、@Config等装饰器中的一种`)
        }

        try {
            let instance = null
            if (Reflect.getMetadata(Config, target.prototype)) {
                instance = Utils.getConfigValue(target)
            } else {
                instance = Reflect.construct(target, await this.getParamInstances(target))
            }

            this.componentInstanceMap.set(target, instance)
            await this.resolveAutowiredDependences(instance)
            this.resolveValues(instance)

            let initMethod = Reflect.getMetadata('$initMethod', target.prototype)
            if (initMethod) {
                await instance[initMethod]()
            }

            let $scheduleJobs = Reflect.getMetadata('$scheduleJobs', target.prototype)
            if ($scheduleJobs) {
                $scheduleJobs.forEach((a: { name: string, rule: ScheduleRule }) => {
                    schedule.scheduleJob(a.rule, instance[a.name].bind(instance))
                })
            }

            return instance
        } catch (error) {
            console.error(`初始化${target.name}时发生错误`)
            throw error
        }
    }

    private async getParamInstances(target: new (...args: any[]) => {}): Promise<any[]> {
        let paramTypes = Reflect.getMetadata('$paramTypes', target.prototype)
        let paramInstances = []
        for (let paramType of paramTypes) {
            let paramInstance = await this.getComponentInstanceFromFactory(paramType)
            paramInstances.push(paramInstance)
        }
        return paramInstances
    }

    private async resolveAutowiredDependences(instance: any) {
        let target = instance.__proto__.constructor
        let autowiredMap = Reflect.getMetadata('$autowiredMap', target.prototype)
        if (autowiredMap) {
            for (let [k, v] of autowiredMap) {
                if (v.name) {
                    instance[k] = await this.getComponentInstanceFromFactory(v as any)
                } else {
                    let _Class = v()
                    instance[k] = await this.getComponentInstanceFromFactory(_Class as any)
                }
            }
        }
    }

    private resolveValues(instance: any) {
        let target = instance.__proto__.constructor
        let valueMap = Reflect.getMetadata('$valueMap', target.prototype)
        if (valueMap) {
            for (let [k, v] of valueMap) {
                instance[k] = Utils.getValueByField(v.type, v.field)
            }
        }
    }

    /**
     * 装载一个类型，但是不会实例化
     * @param _class 类型
     */
    loadClass(_class: new (...args: any[]) => {}) {
        if (Reflect.getMetadata(Component, _class.prototype)) {
            this.componentSet.add(_class)
        }

        return this
    }

    /**
     * 装载一个模块中的所有类，但是不会实例化
     * @param _Module 模块
     */
    loadModule(_Module: any) {
        Object.values(_Module).filter(a => a instanceof Function)
            .forEach((a: new (...args: any[]) => {}) => {
                this.loadClass(a)
            })

        return this
    }

    /**
     * 装载一个文件中的所有类，但是不会实例化，已经装载过的文件会被记录，不会重复装载
     * @param filename 文件绝对路径
     */
    loadFile(filename: string) {
        if (require.cache[filename]) {
            return
        }
        let _Module = Utils.tryRequire(filename)
        if (_Module == null) {
            return
        }
        this.loadModule(_Module)

        return this
    }

    /**
     * 装载一个文件中的所有类，但是不会实例化
     * @param dir 文件夹绝对路径
     */
    loadDir(dir: string) {
        let files = Utils.getAllFileListInDir(dir)
        files.forEach(a => this.loadFile(a))

        return this
    }

    /**
     * 获取所有使用此装饰器的组件
     * @param decorator 装饰器
     */
    @InnerCachable({ keys: [[0, '']] })
    getComponentsByDecorator(decorator: Function) {
        return Array.from(this.componentSet).filter(a => Reflect.getMetadata(decorator, a.prototype))
    }

    private async initStartUps() {
        let startUpClassList = this.getComponentsByDecorator(StartUp).sort((a, b) => Reflect.getMetadata('$order', b.prototype) - Reflect.getMetadata('$order', a.prototype))
        for (let startUp of startUpClassList) {
            await this.getComponentInstanceFromFactory(startUp)
        }
    }

    private async test() {
        if (process.argv.includes('-t') == false) {
            return
        }
        let testClassList = this.getComponentsByDecorator(Test)
        if (testClassList.length == 0) {
            return
        }
        let onlyList = testClassList.filter(a => Reflect.getMetadata('$only', a.prototype) == true)
        if (onlyList.length > 0) {
            testClassList = onlyList
        }

        console.log('Running tests...')
        let startTime = Date.now()

        let failCount = 0
        let results: { name: string, passed: boolean, error?: Error | any, period?: number }[] = []
        for (let _Class of testClassList) {
            let _prototype = _Class.prototype
            let testInstance = await this.getComponentInstanceFromFactory(_Class)
            let testMethods: string[] = Reflect.getMetadata('$testMethods', _prototype)
            if (!testMethods || testMethods.length == 0) {
                continue
            }
            let onlyMethods = testMethods.filter(a => Reflect.getMetadata('$only', _prototype, a) == true)
            if (onlyMethods.length > 0) {
                testMethods = onlyMethods
            }
            for (let testMethod of testMethods) {
                let result: { name: string, passed: boolean, error?: Error | any, period?: number } = {
                    name: _Class.name + '/' + testMethod,
                    passed: false
                }
                let startTime = Date.now()
                try {
                    await testInstance[testMethod]()
                    result.passed = true
                } catch (error) {
                    result.passed = false
                    result.error = error
                    failCount += 1
                } finally {
                    let endTime = Date.now()
                    let ts = endTime - startTime
                    result.period = ts
                    results.push(result)
                }
            }
        }

        let endTime = Date.now()
        results.forEach(a => {
            console.log(`%c${a.passed ? 'PASS' : 'FAIL'}`, ` ${a.passed ? 'background: #00ff00;' : 'background: #ff0000; color: #fff'};`, `${a.name} in ${a.period}ms`)
            if (a.error) {
                console.error(a.error.stack)
            }
        })
        console.log(`All tests ran in ${endTime - startTime}ms, total: ${results.length}, pass: ${results.length - failCount}, ${failCount > 0 ? '%c' : ''}fail: ${failCount}`, ...(failCount > 0 ? ['background: #ff0000; color: #fff'] : ''))
    }

    /**
     * 运行容器，此步骤会自动装载程序执行文件夹（src或者bin），然后实例化所有StartUp组件，然后执行所有测试
     */
    async runAsync() {
        this.loadDir(Utils.getExecRootPath())

        await this.initStartUps()
        await this.test()

        return this
    }
}

let _instance: DIContainer
/**
 * 获取aos4n全局唯一的容器实例
 */
export function getContainer() {
    if (_instance == null) {
        _instance = new DIContainer()
    }
    return _instance
}