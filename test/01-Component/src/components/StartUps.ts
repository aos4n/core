import { Autowired, Init, ScheduleJob, StartUp, Utils, Value } from '../../../../bin';
import { Component5 } from './Component5';
import { Component1, Component3, Component4, Component7 } from './Components';
import { Config1, Config2 } from './Configs';

@StartUp()
export class StartUp1 {
    startTime: number
    endTime: number

    constructor(private readonly c1: Component1, private readonly cfg1: Config1, private readonly cfg2: Config2) {
        this.startTime = Date.now()
    }

    @Init
    private async init() {
        await Utils.sleep(50)
        this.endTime = Date.now()
    }
}

@StartUp(2)
export class StartUp2 {
    startTime: number

    @Init
    private async init() {
        await Utils.sleep(50)
        this.startTime = Date.now()
    }
}

@StartUp(3)
export class StartUp3 {
    startTime: number

    @Init
    private async init() {
        await Utils.sleep(50)
        this.startTime = Date.now()
    }
}

@StartUp()
export class StartUp4 {
    @Autowired(Component3)
    c3: Component3

    @Autowired(() => Component4)
    c4: Component4
}

@StartUp()
export class StartUp5 {
    @Autowired(Component5)
    c5: Component5
}

@StartUp()
export class StartUp6 {
    @Autowired(Component7)
    c7: Component7
}

@StartUp()
export class StartUp7 {
    @Autowired(Component7)
    c7: Component7
}

@StartUp()
export class StartUp8 {
    @Value('f1')
    f1: string

    @Value('f3')
    f3: number

    @Value('fNull')
    fNull: number
}

@StartUp()
export class StartUp9 {
    n: number = 1
    @ScheduleJob('* * * * * *')
    job() {
        this.n = 2
    }
}