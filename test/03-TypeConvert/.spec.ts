import { DIContainer, TypeConvertException } from '../../bin';
import { containerPromise } from './src/app';
import { ContactInfo, CreateIM, EmailInfo } from './src/model/CreateIM';
import { StartUp1 } from './src/StartUps';

let container: DIContainer
beforeAll(async function () {
    container = await containerPromise
})

test('转换得到的对象属于目标类型', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    let im = s1.getCreateIM()
    expect(im).toBeInstanceOf(CreateIM)
})

test('简单类型的字段', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    let im = s1.getCreateIM()
    expect(im.age).toBe(17)
})

test('复杂类型的字段', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    let im = s1.getCreateIM()
    expect(im.contactInfo).toBeInstanceOf(ContactInfo)
})

test('简单类型的数组字段', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    let im = s1.getCreateIM()
    expect(im.imgs).toBeInstanceOf(Array)
    expect(im.imgs[0]).toBe('http://abc.com/a.jpg')
})

test('复杂类型的数组字段', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    let im = s1.getCreateIM()
    expect(im.emailInfos).toBeInstanceOf(Array)
    expect(im.emailInfos[0]).toBeInstanceOf(EmailInfo)
})

test('目标类型可以使用默认值，如果原对象具有该字段（不管是何值），将会覆盖', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    let im = s1.getCreateIM()
    expect(im.remark).toBe('empty text')
    expect(im.enabled).toBe(false)
    expect(im.grade).toBeNull()
})

test('对于原对象具有，但是目标类型没有声明的字段，将会复制到目标对象', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    let im = s1.getCreateIM() as any
    expect(im.otherField).toBe('test')
})

test('无法转换的值将会抛出错误', async function () {
    let s1 = container.getComponentInstance(StartUp1)
    let _error: any
    try {
        s1.getUpdateIM()
    } catch (error) {
        _error = error
    }
    expect(_error).toBeInstanceOf(TypeConvertException)
})