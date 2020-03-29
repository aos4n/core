import fs = require('fs');
import path = require('path');
import { Component } from './Component';
import { TypeSpecifiedMap } from './TypeSpecifiedMap';
import { TypeSpecifiedType } from './TypeSpecifiedType';

/**
 * 一些工具方法
 */
export class Utils {
    /**
     * 标记为组件
     * @param target 目标类型
     */
    static markAsComponent(target: new (...args: any[]) => {}) {
        Reflect.defineMetadata(Component, true, target.prototype)
        let paramTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', target) || []
        if (paramTypes.includes(target)) {
            console.error(`${target.name}中存在自我依赖`)
            process.abort()
        }
        Reflect.defineMetadata('$paramTypes', paramTypes, target.prototype)
    }

    /**
     * 递归获取指定文件夹下所有文件列表
     * @param dirPath 指定的文件夹
     */
    static getAllFileListInDir(dirPath: string) {
        let list = fs.readdirSync(dirPath)
        let fileList: string[] = []
        list.forEach(a => {
            let filePath = path.join(dirPath, a)
            let fileState = fs.statSync(filePath)
            if (fileState.isDirectory()) {
                fileList = fileList.concat(this.getAllFileListInDir(filePath))
            } else {
                fileList.push(filePath)
            }
        })
        return fileList
    }

    /**
     * 获取指定文件夹下所有子文件夹，不包含文件夹以及子文件夹内的文件
     * @param dirPath 指定的文件夹
     */
    static getDirListInDir(dirPath: string) {
        let list = fs.readdirSync(dirPath)
        return list.filter(a => {
            let filePath = path.join(dirPath, a)
            let fileState = fs.statSync(filePath)
            return fileState.isDirectory()
        })
    }

    /**
     * 获取指定文件夹下的所有文件列表，不包含文件以及子文件夹内的文件夹
     * @param dirPath 指定的文件夹
     */
    static getFileListInDir(dirPath: string) {
        let list = fs.readdirSync(dirPath)
        return list.filter(a => {
            let filePath = path.join(dirPath, a)
            let fileState = fs.statSync(filePath)
            return fileState.isFile()
        })
    }

    /**
     * 使当前执行栈暂停milliseconds毫秒，这不会阻塞应用的现成
     * @param milliseconds 暂停的时间，单位：毫秒
     */
    static sleep(milliseconds: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, milliseconds)
        })
    }

    /**
     * 获取程序的入口文件，优先读取环境变量：aos4nEntry，其次读取process.mainModule.filename
     * 一般情况下，使用node app.js获取pm2 start app.js启动程序，process.mainModule.filename就是app的绝对路径
     * 但是使用测试框架（比如jest）进行测试时process.mainModule.filename可能是测试框架的启动文件路径
     * 如果你需要使用测试框架测试程序，请手动指定环境变量aos4nEntry
     */
    static getEntryFilename() {
        return process.env.aos4nEntry || process.mainModule.filename
    }

    private static appRootPath: string
    /**
     * 获取程序根目录，也就是package.json所在的目录
     */
    static getAppRootPath() {
        if (!this.appRootPath) {
            this.appRootPath = path.resolve(Utils.getEntryFilename(), '..', '..')
        }
        return this.appRootPath
    }

    private static execRootPath: string
    /**
     * 获取程序执行目录，对于ts启动的程序，为src目录绝对路径，对于js启动的程序，为bin目录绝对路径
     */
    static getExecRootPath() {
        if (!this.execRootPath) {
            if (Utils.getEntryFilename().endsWith('.ts')) {
                this.execRootPath = path.join(this.getAppRootPath(), 'src')
            } else {
                this.execRootPath = path.join(this.getAppRootPath(), 'bin')
            }
        }
        return this.execRootPath
    }

    /**
     * 获取配置文件绝对路径，也就是与package.json同级的config.json文件的绝对路径
     */
    static getConfigFilename() {
        return path.join(this.getAppRootPath(), 'config.json')
    }

    /**
     * 获取配置值
     * @param target 配置类型
     */
    static getConfigValue<T>(target: new (...args: any[]) => T): T {
        let configFilePath = Utils.getConfigFilename()
        let originalVal = this.tryRequire(configFilePath)
        let newVal = Utils.getValBySectionStr(originalVal, Reflect.getMetadata('$configField', target.prototype))
        return Utils.getTypeSpecifiedValue(target, newVal, new target())
    }

    /**
     * 尝试require一个文件，如果失败，会返回null
     * @param filePath 文件路径
     */
    static tryRequire(filePath: string) {
        if (filePath.endsWith('.map') || filePath.endsWith('.d.ts')) {
            return null
        }
        try {
            return require(filePath)
        } catch (error) {
            return null
        }
    }

    private static getValBySectionArr(originalVal: any, sectionArr: string[]) {
        let newVal = originalVal
        for (let a of sectionArr) {
            if (newVal == null) {
                break
            }
            newVal = newVal[a]
        }

        return newVal
    }

    /**
     * 获取该对象指定节的值
     * @param originalVal 对象
     * @param keysStr 节，格式：空字符串、a、a.b
     */
    static getValBySectionStr(originalVal: any, keysStr: string) {
        let sectionArr = keysStr.split('.').filter(a => a)
        return Utils.getValBySectionArr(originalVal, sectionArr)
    }

    /**
     * 获取指定类型的对象
     * @param type 指定的类型
     * @param sourceVal 原始对象
     * @param valIfNull 如果originalVal == null则返回的值
     */
    static getTypeSpecifiedValue<T>(type: Function | (new (...args: any[]) => T), sourceVal: any, valIfNull: T = null): T {
        if (sourceVal == null) {
            return valIfNull
        }
        switch (type) {
            case Number:
            case Boolean:
                if (sourceVal === '') {
                    return null
                }
                return type(sourceVal)
            case String:
                return type(sourceVal).trim()
            case Date:
                if (sourceVal === '') {
                    return null
                }
                return new Date(sourceVal) as any
            default:
                let newVal = Reflect.construct(type, [])
                let sourceFields = Reflect.getMetadata('$sourceFields', type.prototype) || {}
                for (let sourceField in sourceVal) {
                    let sourceFieldVal = sourceVal[sourceField]
                    let typeSpecifiedMap: TypeSpecifiedMap = sourceFields[sourceField] as TypeSpecifiedMap
                    if (typeSpecifiedMap == null) {
                        newVal[sourceField] = sourceFieldVal
                    } else {
                        let targetField = typeSpecifiedMap.targetName
                        if (typeSpecifiedMap.typeSpecifiedType == TypeSpecifiedType.General) {
                            newVal[targetField] = this.getTypeSpecifiedValue(typeSpecifiedMap.type, sourceFieldVal)
                        } else if (typeSpecifiedMap.typeSpecifiedType == TypeSpecifiedType.Array) {
                            if (Array.isArray(sourceFieldVal)) {
                                newVal[targetField] = sourceFieldVal.map((a: any) => this.getTypeSpecifiedValue(typeSpecifiedMap.type, a))
                            } else {
                                newVal[targetField] = null
                            }
                        }
                    }
                }
                return newVal
        }
    }

    /**
     * 获取指定类型的数组对象
     * @param type 指定的类型
     * @param originalVal 原始对象
     */
    static getTypeSpecifiedValueArray<T>(type: Function | (new (...args: any[]) => T), originalVal: any[], valIfNull: T[] = null): T[] {
        if (originalVal == null) {
            return valIfNull
        }
        return originalVal.map(a => this.getTypeSpecifiedValue(type, a))
    }

    /**
     * 格式化日期
     * @param dt 日期
     * @param format 格式，yyyy：年，MM：月，dd：日，HH：时（24小时制），mm：分，ss：秒，比如：yyyy-MM-dd HH:mm:ss
     */
    static formatDate(dt: Date, format: string) {
        let result: any = {}
        result.yyyy = dt.getFullYear()
        result.MM = dt.getMonth() + 1
        result.dd = dt.getDate()
        result.HH = dt.getHours()
        result.mm = dt.getMinutes()
        result.ss = dt.getSeconds()
        let _result = format
        for (let p in result) {
            _result = _result.replace(p, result[p].toString().padStart(p.length, '0'))
        }
        return _result
    }
}