import { Autowired, Component } from '../../../../bin';
import { Component6 } from './Component6';

@Component
export class Component5 {
    startTime: number

    constructor() {
        this.startTime = Date.now()
    }

    @Autowired(() => Component6)
    c6: Component6
}