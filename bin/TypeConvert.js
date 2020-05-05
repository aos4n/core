"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypeSpecifiedMap_1 = require("./TypeSpecifiedMap");
const TypeSpecifiedType_1 = require("./TypeSpecifiedType");
/**
 * 指定此字段需要转换为指定类型，仅仅支持number、string、boolean、Date，不支持联合类型，比如number | string
 */
function Typed(target, name) {
    let $typedFields = Reflect.getMetadata('$typedFields', target) || {};
    $typedFields[name] = new TypeSpecifiedMap_1.TypeSpecifiedMap(TypeSpecifiedType_1.TypeSpecifiedType.General, Reflect.getMetadata('design:type', target, name));
    Reflect.defineMetadata('$typedFields', $typedFields, target);
}
exports.Typed = Typed;
/**
 * 指定此Array字段的确切类型需要转换为指定类型
 * @param type 确切类型
 */
function TypedArray(type) {
    return function (target, name) {
        let $typedFields = Reflect.getMetadata('$typedFields', target) || {};
        $typedFields[name] = new TypeSpecifiedMap_1.TypeSpecifiedMap(TypeSpecifiedType_1.TypeSpecifiedType.Array, type);
        Reflect.defineMetadata('$typedFields', $typedFields, target);
    };
}
exports.TypedArray = TypedArray;
/**
 * 转换数据类型失败抛出的错误
 */
class TypeConvertException extends Error {
    constructor(val, type) {
        super();
        this.val = val;
        this.type = type;
    }
    get message() {
        return `无法将值${this.val}转换为类型${this.type.name}`;
    }
}
exports.TypeConvertException = TypeConvertException;
//# sourceMappingURL=TypeConvert.js.map