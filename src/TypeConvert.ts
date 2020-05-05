import { TypeSpecifiedMap } from './TypeSpecifiedMap';
import { TypeSpecifiedType } from './TypeSpecifiedType';

/**
 * 指定此字段需要转换为指定类型，仅仅支持number、string、boolean、Date，不支持联合类型，比如number | string
 */
export function Typed(target: any, name: string) {
    let $typedFields = Reflect.getMetadata('$typedFields', target) || {}
    $typedFields[name] = new TypeSpecifiedMap(TypeSpecifiedType.General, Reflect.getMetadata('design:type', target, name))
    Reflect.defineMetadata('$typedFields', $typedFields, target)
}

/**
 * 指定此Array字段的确切类型需要转换为指定类型
 * @param type 确切类型
 */
export function TypedArray(type: Function) {
    return function (target: any, name: string) {
        let $typedFields = Reflect.getMetadata('$typedFields', target) || {}
        $typedFields[name] = new TypeSpecifiedMap(TypeSpecifiedType.Array, type)
        Reflect.defineMetadata('$typedFields', $typedFields, target)
    }
}

/**
 * 转换数据类型失败抛出的错误
 */
export class TypeConvertException extends Error {
    constructor(private readonly val: any, private readonly type: Function | (new (...args: any[]) => {})) {
        super()
    }

    get message() {
        return `无法将值${this.val}转换为类型${this.type.name}`
    }
}