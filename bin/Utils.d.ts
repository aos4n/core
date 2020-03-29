/**
 * 一些工具方法
 */
export declare class Utils {
    /**
     * 标记为组件
     * @param target 目标类型
     */
    static markAsComponent(target: new (...args: any[]) => {}): void;
    /**
     * 递归获取指定文件夹下所有文件列表
     * @param dirPath 指定的文件夹
     */
    static getAllFileListInDir(dirPath: string): string[];
    /**
     * 获取指定文件夹下所有子文件夹，不包含文件夹以及子文件夹内的文件
     * @param dirPath 指定的文件夹
     */
    static getDirListInDir(dirPath: string): string[];
    /**
     * 获取指定文件夹下的所有文件列表，不包含文件以及子文件夹内的文件夹
     * @param dirPath 指定的文件夹
     */
    static getFileListInDir(dirPath: string): string[];
    /**
     * 使当前执行栈暂停milliseconds毫秒，这不会阻塞应用的现成
     * @param milliseconds 暂停的时间，单位：毫秒
     */
    static sleep(milliseconds: number): Promise<unknown>;
    /**
     * 获取程序的入口文件，优先读取环境变量：aos4nEntry，其次读取process.mainModule.filename
     * 一般情况下，使用node app.js获取pm2 start app.js启动程序，process.mainModule.filename就是app的绝对路径
     * 但是使用测试框架（比如jest）进行测试时process.mainModule.filename可能是测试框架的启动文件路径
     * 如果你需要使用测试框架测试程序，请手动指定环境变量aos4nEntry
     */
    static getEntryFilename(): string;
    private static appRootPath;
    /**
     * 获取程序根目录，也就是package.json所在的目录
     */
    static getAppRootPath(): string;
    private static execRootPath;
    /**
     * 获取程序执行目录，对于ts启动的程序，为src目录绝对路径，对于js启动的程序，为bin目录绝对路径
     */
    static getExecRootPath(): string;
    /**
     * 获取配置文件绝对路径，也就是与package.json同级的config.json文件的绝对路径
     */
    static getConfigFilename(): string;
    /**
     * 获取配置值
     * @param target 配置类型
     */
    static getConfigValue<T>(target: new (...args: any[]) => T): T;
    /**
     * 尝试require一个文件，如果失败，会返回null
     * @param filePath 文件路径
     */
    static tryRequire(filePath: string): any;
    private static getValBySectionArr;
    /**
     * 获取该对象指定节的值
     * @param originalVal 对象
     * @param keysStr 节，格式：空字符串、a、a.b
     */
    static getValBySectionStr(originalVal: any, keysStr: string): any;
    /**
     * 获取指定类型的对象
     * @param type 指定的类型
     * @param sourceVal 原始对象
     * @param valIfNull 如果originalVal == null则返回的值
     */
    static getTypeSpecifiedValue<T>(type: Function | (new (...args: any[]) => T), sourceVal: any, valIfNull?: T): T;
    /**
     * 获取指定类型的数组对象
     * @param type 指定的类型
     * @param originalVal 原始对象
     */
    static getTypeSpecifiedValueArray<T>(type: Function | (new (...args: any[]) => T), originalVal: any[], valIfNull?: T[]): T[];
    /**
     * 格式化日期
     * @param dt 日期
     * @param format 格式，yyyy：年，MM：月，dd：日，HH：时（24小时制），mm：分，ss：秒，比如：yyyy-MM-dd HH:mm:ss
     */
    static formatDate(dt: Date, format: string): string;
}
