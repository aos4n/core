import { ScheduleRule } from './Alias';
import { Utils } from './Utils';

/**
 * 指定此类为组件，生命周期将完全交给aos4n管理
 * 所有组件将在程序启动的时候初始化完成，所有组件初始化完成后，程序才会开始接受http请求
 * @param target 
 */
export function Component(target: new (...args: any[]) => {}) {
    Utils.markAsComponent(target)
}

/**
 * 指定此类为预启动组件，将在程序启动时预先启动。
 * 事实上，所有的组件只要被使用到都会在程序启动时预先启动，使用StartUp标记那些没有被其他组件使用的组件，确保此组件也能启动
 * StartUp是一种特殊的Component
 * @param order 优先级，值越大越优先启动，默认值：0
 */
export function StartUp(order: number = 0) {
    return function (target: new (...args: any[]) => {}) {
        Reflect.defineMetadata(StartUp, true, target.prototype)
        Reflect.defineMetadata('$order', order, target.prototype)
        Utils.markAsComponent(target)
    }
}

/**
 * 表示一个配置文件映射器
 * Config是一种特殊的Component
 * @param field：需要映射的节，默认映射整个文件，
 * 如果需要映射子节，可以使用app、app.redis这样的格式指定
 */
export function Config(field: string = '') {
    return function (target: new (...args: any[]) => {}) {
        Reflect.defineMetadata(Config, true, target.prototype)
        Reflect.defineMetadata('$configField', field, target.prototype)
        Utils.markAsComponent(target)
    }
}

/**
 * 便捷的映射配置文件的某一个字段，不支持数组
 * @param field 需要映射的节，默认映射整个文件
 */
export function Value(field: string) {
    return function (target: any, name: string) {
        let $valueMap = Reflect.getMetadata('$valueMap', target) || new Map()
        let type = Reflect.getMetadata('design:type', target, name)
        $valueMap.set(name, { field, type })
        Reflect.defineMetadata('$valueMap', $valueMap, target)
    }
}

/**
 * 通过属性注入依赖的组件
 * @param type 目标类型或者产出目标类型的函数，
 * 对于循环依赖，需要使用产出目标类型的函数，否则会出现目标类型解析为undefined
 */
export function Autowired(type: (new (...args: any[]) => {}) | (() => new (...args: any[]) => {})) {
    return function (target: any, name: string) {
        if (!type) {
            console.error(`${target.constructor.name}中存在不正确的循环依赖${name}，请使用@Autowired(() => type of ${name})注入此依赖项`)
            process.abort()
        }

        let $autowiredMap = Reflect.getMetadata('$autowiredMap', target) || new Map()
        $autowiredMap.set(name, type)
        Reflect.defineMetadata('$autowiredMap', $autowiredMap, target)
    }
}

/**
 * 在组件中标记一个方法，使其在组件初始化时执行，支持异步方法，不能用在Config组件中
 */
export function Init(target: any, name: string) {
    Reflect.defineMetadata('$initMethod', name, target)
}

/**
 * 标记一个方法为计划任务，支持异步方法，aos4n使用node-schedule来实现计划任务
 */
export function ScheduleJob(rule: ScheduleRule) {
    return function (target: any, name: string) {
        let $scheduleJobs = Reflect.getMetadata('$scheduleJobs', target) || []
        $scheduleJobs.push({
            name,
            rule
        })
        Reflect.defineMetadata('$scheduleJobs', $scheduleJobs, target)
    }
}

/**
 * 标记一个类为测试类，程序启动完成后，将会自动执行这些测试
 */
export function Test(target: new (...args: any[]) => {}) {
    Reflect.defineMetadata(Test, true, target.prototype)
    Utils.markAsComponent(target)
}

/**
 * 标记一个方法为测试方法，程序启动完成后，将会自动执行这些测试
 * 仅能在Test类中使用
 */
export function Spec(target: any, name: string) {
    let $testMethods = Reflect.getMetadata('$testMethods', target) || []
    $testMethods.push(name)
    Reflect.defineMetadata('$testMethods', $testMethods, target)
}