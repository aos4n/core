import { Component, Init, Utils } from '../../../../bin';

@Component
export class Component1 {
    startTime: number
    endTime: number

    constructor() {
        this.startTime = Date.now()
    }

    @Init
    private async init() {
        await Utils.sleep(50)
        this.endTime = Date.now()
    }
}

@Component
export class Component2 {
    startTime: number
    endTime: number

    constructor() {
        this.startTime = Date.now()
    }

    @Init
    private async init() {
        await Utils.sleep(50)
        this.endTime = Date.now()
    }
}

@Component
export class Component3 {
    startTime: number
    endTime: number

    constructor() {
        this.startTime = Date.now()
    }

    @Init
    private async init() {
        await Utils.sleep(50)
        this.endTime = Date.now()
    }
}

@Component
export class Component4 {
    startTime: number
    endTime: number

    constructor() {
        this.startTime = Date.now()
    }

    @Init
    private async init() {
        await Utils.sleep(50)
        this.endTime = Date.now()
    }
}

@Component
export class Component7 {
    startTime: number = 1
}