/**
 * aos4n管理组件生命周期的容器，全局只会有一个实例
 */
export declare class DIContainer {
    readonly startTime: number;
    private componentSet;
    private componentInstanceMap;
    constructor();
    /**
     * 将已经实例化好的对象添加进容器
     * @param target 类型
     * @param instance 实例
     */
    setComponentInstance<T>(target: new (...args: any[]) => T, instance: T): void;
    /**
     * 以同步的方式根据指定类型从容器取出实例，需要确保此时类实例已经存在
     * @param target 类型
     */
    getComponentInstance<T>(target: new (...args: any[]) => T): T;
    /**
     * 从工厂获取指定类型的组件实例，如果此组件类型没有一个可用实例，会创建一个实例然后返回给调用者
     * 这是一个异步方法，不能在构造器中起作用，所以请仅仅在程序启动的时候使用此方法
     * 程序运行中获取实例应该使用同步方法getComponentInstance
     * @param target 组件类型
     */
    getComponentInstanceFromFactory<T>(target: new (...args: any[]) => T): Promise<T>;
    private createComponentInstance;
    private getParamInstances;
    private resolveAutowiredDependences;
    /**
     * 装载一个类型，但是不会实例化
     * @param _class 类型
     */
    loadClass(_class: new (...args: any[]) => {}): this;
    /**
     * 装载一个模块中的所有类，但是不会实例化
     * @param _Module 模块
     */
    loadModule(_Module: any): this;
    /**
     * 装载一个文件中的所有类，但是不会实例化，已经装载过的文件会被记录，不会重复装载
     * @param filename 文件绝对路径
     */
    loadFile(filename: string): this;
    /**
     * 装载一个文件中的所有类，但是不会实例化
     * @param dir 文件夹绝对路径
     */
    loadDir(dir: string): this;
    /**
     * 获取所有使用此装饰器的组件
     * @param decorator 装饰器
     */
    getComponentsByDecorator(decorator: Function): (new (...args: any[]) => {})[];
    private initStartUps;
    private test;
    /**
     * 运行容器，此步骤会自动装载程序执行文件夹（src或者bin），然后实例化所有StartUp组件，然后执行所有测试
     */
    runAsync(): Promise<this>;
}
/**
 * 获取aos4n全局唯一的容器实例
 */
export declare function getContainer(): DIContainer;
