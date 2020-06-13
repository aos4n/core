# 介绍
aos4n-core是aos4n系列的基础框架，集成了Component、Config、TypeConvert、ScheduleJob等基础功能
# 安装
```bash
npm i aos4n/core
```
# 使用
```typescript
import { getContainer } from "aos4n-core"

process.env.aos4nEntry = __filename

getContainer().runAsync()
```
# api
## @StartUp
使用@StartUp装饰器标记一个类为预启动组件，并且传入一个可选的order参数
```typescript
import { StartUp, Init } from "aos4n-core";

@StartUp()
export class StartUp1 {
    index: number;

    @Init
    private init() {
        this.index = 0;
    }

    doSth() {
        return this.index++
    }
}
```

## @Config
使用@Config标记一个类为配置文件映射器。使用配置文件映射器，而不是require('config.json')，前者得到的对象具有类型声明，更便于使用。

field参数表示映射器映射的配置节，如果不传，表示整个配置文件，使用a.b.c映射a节下的b节下的c。

⚠️所以，不要在你的配置文件中使用任何类似于a.b表示一个节，这会使配置映射器出错。
```json
{
    "mysql": {
        "host": "127.0.0.1",
        "port": 3306,
        "user": "root",
        "password": "524163",
        "db": "test1"
    }
}
```
## @Component
使用@Component标记一个类为组件
```typescript
import { Component, Init } from "aos4n-core";

@Component
export class HomeService {
    @Init
    doInit() { }

    getSth() {
        return 1
    }
}
```
## @Init
在组件中，使用@Init标记一个方法，此方法用于初始化组件，支持异步方法。
## @ScheduleJob
在组件中，标记一个方法为计划任务，支持异步方法，aos4n使用node-schedule来实现计划任务
```typescript
@StartUp()
export class StartUp9 {
    n: number = 1
    @ScheduleJob('* * * * * *')
    job() {
        this.n = 2
    }
}
```
## @Autowired
用于属性注入，用法如下
```typescript
@Component()
export class MyComponent{
  @Autowired(UserService)
  userService: UserService

  index(){
    return this.userService.doSomething()
  }
}
```
## @Typed
表示此字段需要转换为指定类型
## @TypedArray
如果需要转换的字段是一个数组，@Typed就无法胜任了，因为ts的Array是一个泛型，且程序运行时无法知道泛型确切类型，所以转换数组时还需要指定确切类型