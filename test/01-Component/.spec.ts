import { DIContainer, Utils } from '../../bin';
import { containerPromise } from './src/app';
import { Component1, Component2 } from './src/components/Components';
import { Config1, Config2 } from './src/components/Configs';
import {
    StartUp1, StartUp2, StartUp3, StartUp4, StartUp5, StartUp6, StartUp7, StartUp8, StartUp9
} from './src/components/StartUps';

let container: DIContainer
beforeAll(async function () {
    container = await containerPromise
})

test('普通Component被依赖（使用）到的组件才会初始化', async function () {
    let c1 = container.getComponentInstance(Component1)
    let c2 = container.getComponentInstance(Component2)
    expect(c1).toBeTruthy()
    expect(c2).toBeFalsy()
})

test('Component初始化时会自动调用Init标记的方法，顺序为在构造器之后', async function () {
    let c1 = container.getComponentInstance(Component1)
    expect(c1.startTime).toBeLessThan(c1.endTime)
})

test('StartUp会自动初始化', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    expect(s1).toBeTruthy()
})

test('StartUp的order参数越大，优先级越高', async function () {
    let s2 = container.getComponentInstance(StartUp2)
    let s3 = container.getComponentInstance(StartUp3)
    expect(s3.startTime).toBeLessThan(s2.startTime)
})

test('Config默认映射整个配置文件', async function () {
    let c1 = container.getComponentInstance(Config1)
    expect(c1.f1).toBe('test')
    expect(c1.f2).toBe(1)
    expect(c1.f3).toBe(1)
})

test('Config可以指定field映射某一个节', async function () {
    let c2 = container.getComponentInstance(Config2)
    expect(c2.f5).toBe(2)
})

test('使用Value映射配置文件的某一个字段', async function () {
    let s8 = container.getComponentInstance(StartUp8)
    expect(s8.f1).toBe('test')
    expect(s8.f3).toBe(1)
    expect(s8.fNull).toBeNull()
})

test('Autowired方式注入组件', async function () {
    let s4 = container.getComponentInstance(StartUp4)
    expect(s4.c3.startTime).toBeTruthy()
    expect(s4.c4.startTime).toBeTruthy()
})

test('使用Autowired实现循环依赖', async function () {
    let s5 = container.getComponentInstance(StartUp5)
    expect(s5.c5.c6.c5.startTime).toBeTruthy()
})

test('组件都是单例', async function () {
    let s6 = container.getComponentInstance(StartUp6)
    let s7 = container.getComponentInstance(StartUp7)
    expect(s6.c7).toBeTruthy()
    expect(s6.c7).toBe(s7.c7)
})

test('计划任务', async function () {
    let s9 = container.getComponentInstance(StartUp9)
    expect(s9.n).toBe(1)
    await Utils.sleep(1000)
    expect(s9.n).toBe(2)
})