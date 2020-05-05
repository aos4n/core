"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
/**
 * 指定此类为组件，生命周期将完全交给aos4n管理
 * 所有组件将在程序启动的时候初始化完成，所有组件初始化完成后，程序才会开始接受http请求
 * @param target
 */
function Component(target) {
    Utils_1.Utils.markAsComponent(target);
}
exports.Component = Component;
/**
 * 指定此类为预启动组件，将在程序启动时预先启动。
 * 事实上，所有的组件只要被使用到都会在程序启动时预先启动，使用StartUp标记那些没有被其他组件使用的组件，确保此组件也能启动
 * StartUp是一种特殊的Component
 * @param order 优先级，值越大越优先启动，默认值：0
 */
function StartUp(order = 0) {
    return function (target) {
        Reflect.defineMetadata(StartUp, true, target.prototype);
        Reflect.defineMetadata('$order', order, target.prototype);
        Utils_1.Utils.markAsComponent(target);
    };
}
exports.StartUp = StartUp;
/**
 * 表示一个配置文件映射器
 * Config是一种特殊的Component
 * @param field：需要映射的节，默认映射整个文件，
 * 如果需要映射子节，可以使用app、app.redis这样的格式指定
 */
function Config(field = '') {
    return function (target) {
        Reflect.defineMetadata(Config, true, target.prototype);
        Reflect.defineMetadata('$configField', field, target.prototype);
        Utils_1.Utils.markAsComponent(target);
    };
}
exports.Config = Config;
/**
 * 便捷的映射配置文件的某一个字段，不支持数组
 * @param field 需要映射的节，默认映射整个文件
 */
function Value(field) {
    return function (target, name) {
        let $valueMap = Reflect.getMetadata('$valueMap', target) || new Map();
        let type = Reflect.getMetadata('design:type', target, name);
        $valueMap.set(name, { field, type });
        Reflect.defineMetadata('$valueMap', $valueMap, target);
    };
}
exports.Value = Value;
/**
 * 通过属性注入依赖的组件
 * @param type 目标类型或者产出目标类型的函数，
 * 对于循环依赖，需要使用产出目标类型的函数，否则会出现目标类型解析为undefined
 */
function Autowired(type) {
    return function (target, name) {
        if (!type) {
            console.error(`${target.constructor.name}中存在不正确的循环依赖${name}，请使用@Autowired(() => type of ${name})注入此依赖项`);
            process.abort();
        }
        let $autowiredMap = Reflect.getMetadata('$autowiredMap', target) || new Map();
        $autowiredMap.set(name, type);
        Reflect.defineMetadata('$autowiredMap', $autowiredMap, target);
    };
}
exports.Autowired = Autowired;
/**
 * 在组件中标记一个方法，使其在组件初始化时执行，支持异步方法，不能用在Config组件中
 */
function Init(target, name) {
    Reflect.defineMetadata('$initMethod', name, target);
}
exports.Init = Init;
/**
 * 标记一个方法为计划任务，支持异步方法，aos4n使用node-schedule来实现计划任务
 */
function ScheduleJob(rule) {
    return function (target, name) {
        let $scheduleJobs = Reflect.getMetadata('$scheduleJobs', target) || [];
        $scheduleJobs.push({
            name,
            rule
        });
        Reflect.defineMetadata('$scheduleJobs', $scheduleJobs, target);
    };
}
exports.ScheduleJob = ScheduleJob;
/**
 * 标记一个类为测试类，程序启动完成后，将会自动执行这些测试
 */
function Test(target) {
    Reflect.defineMetadata(Test, true, target.prototype);
    Utils_1.Utils.markAsComponent(target);
}
exports.Test = Test;
/**
 * 标记一个方法为测试方法，程序启动完成后，将会自动执行这些测试
 * 仅能在Test类中使用
 */
function Spec(target, name) {
    let $testMethods = Reflect.getMetadata('$testMethods', target) || [];
    $testMethods.push(name);
    Reflect.defineMetadata('$testMethods', $testMethods, target);
}
exports.Spec = Spec;
//# sourceMappingURL=Component.js.map