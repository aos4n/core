export declare class CacheNode {
    private readonly parent?;
    private readonly key?;
    private _value;
    private expireTime;
    private children;
    private si;
    constructor(parent?: CacheNode, key?: any);
    private get value();
    private set value(value);
    private check;
    private checkValue;
    private checkChildren;
    get(...keys: any[]): any;
    /**
     * 主动设置缓存
     * @param val 值
     * @param maxAge 有效期，单位：毫秒，null表示永久有效
     * @param keys 结点路径
     */
    set(val: any, maxAge: number, ...keys: any[]): void;
    delete(...keys: any[]): void;
    private removeMyself;
    private clear;
}
