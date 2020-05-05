/**
 * 指定此字段需要转换为指定类型，仅仅支持number、string、boolean、Date，不支持联合类型，比如number | string
 */
export declare function Typed(target: any, name: string): void;
/**
 * 指定此Array字段的确切类型需要转换为指定类型
 * @param type 确切类型
 */
export declare function TypedArray(type: Function): (target: any, name: string) => void;
/**
 * 转换数据类型失败抛出的错误
 */
export declare class TypeConvertException extends Error {
    private readonly val;
    private readonly type;
    constructor(val: any, type: Function | (new (...args: any[]) => {}));
    get message(): string;
}
