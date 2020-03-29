/**
 * 指定此类为组件，生命周期将完全交给aos4n管理
 * 所有组件将在程序启动的时候初始化完成，所有组件初始化完成后，程序才会开始接受http请求
 * @param target
 */
export declare function Component(target: new (...args: any[]) => {}): void;
/**
 * 指定此类为预启动组件，将在程序启动时预先启动。
 * 事实上，所有的组件只要被使用到都会在程序启动时预先启动，使用StartUp标记那些没有被其他组件使用的组件，确保此组件也能启动
 * StartUp是一种特殊的Component
 * @param order 优先级，值越大越优先启动，默认值：0
 */
export declare function StartUp(order?: number): (target: new (...args: any[]) => {}) => void;
/**
 * 表示一个配置文件映射器
 * Config是一种特殊的Component
 * @param field：需要映射的节，默认映射整个文件，
 * 如果需要映射子节，可以使用app、app.redis这样的格式指定
 */
export declare function Config(field?: string): (target: new (...args: any[]) => {}) => void;
/**
 * 通过属性注入依赖的组件
 * @param type 目标类型或者产出目标类型的函数，
 * 对于循环依赖，需要使用产出目标类型的函数，否则会出现目标类型解析为undefined
 */
export declare function Autowired(type: (new (...args: any[]) => {}) | (() => new (...args: any[]) => {})): (target: any, name: string) => void;
/**
 * 在组件中标记一个方法，使其在组件初始化时执行，支持异步方法
 */
export declare function Init(target: any, name: string): void;
/**
 * 标记一个类为测试类，程序启动完成后，将会自动执行这些测试
 */
export declare function Test(target: new (...args: any[]) => {}): void;
/**
 * 标记一个方法为测试方法，程序启动完成后，将会自动执行这些测试
 * 仅能在Test类中使用
 */
export declare function Spec(target: any, name: string): void;
