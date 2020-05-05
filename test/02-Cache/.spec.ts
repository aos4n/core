import { DIContainer, getCache, Utils } from '../../bin';
import { containerPromise } from './src/app';
import { Component1 } from './src/components/Component1';

let container: DIContainer
beforeAll(async function () {
    container = await containerPromise
})

test('不带任何参数的缓存', async function () {
    let c1 = container.getComponentInstance(Component1)
    let t1 = c1.getStartTime()
    await Utils.sleep(50)
    let t2 = c1.getStartTime()
    expect(t1).toBeTruthy()
    expect(t1).toBe(t2)
})

test('支持异步方法', async function () {
    let c1 = container.getComponentInstance(Component1)
    let t1 = await c1.getEndTime()
    await Utils.sleep(50)
    let t2 = await c1.getEndTime()
    expect(t1).toBeTruthy()
    expect(t1).toBe(t2)
})

test('可主动删除缓存', async function () {
    let c1 = container.getComponentInstance(Component1)
    let t1 = c1.getCreateTime()
    await Utils.sleep(50)
    let t2 = c1.getCreateTime()
    expect(t1).toBeTruthy()
    expect(t1).toBe(t2)
    await Utils.sleep(100)
    getCache().delete('Component1', 'getCreateTime')
    let t3 = c1.getCreateTime()
    expect(t1).not.toBe(t3)
})

test('删除缓存时可以指定树干节点，达到删除所有叶子节点的目的', async function () {
    let c1 = container.getComponentInstance(Component1)
    let t1 = c1.getCreateTime()
    await Utils.sleep(50)
    let t2 = c1.getCreateTime()
    expect(t1).toBeTruthy()
    expect(t1).toBe(t2)
    await Utils.sleep(100)
    getCache().delete('Component1')
    let t3 = c1.getCreateTime()
    expect(t1).not.toBe(t3)
})

test('应用级别的缓存可以指定有效期', async function () {
    let c1 = container.getComponentInstance(Component1)
    let t1 = c1.getUpdateTime()
    await Utils.sleep(50)
    let t2 = c1.getUpdateTime()
    expect(t1).toBeTruthy()
    expect(t1).toBe(t2)
    await Utils.sleep(100)
    let t3 = c1.getUpdateTime()
    expect(t1).not.toBe(t3)
})

test('可通过getCache().get、set操作缓存', async function () {
    let c1 = container.getComponentInstance(Component1)
    let t1 = c1.getRemoveTime()
    await Utils.sleep(50)
    let t2 = c1.getRemoveTime()
    expect(t1).toBeTruthy()
    expect(t1).toBe(t2)

    let t3 = getCache().get('Component1', 'getRemoveTime')
    expect(t1).toBe(t3)

    getCache().set(1, null, 'Component1', 'getRemoveTime')
    let t4 = getCache().get('Component1', 'getRemoveTime')
    expect(t1).not.toBe(t4)
    expect(t4).toBe(1)
})