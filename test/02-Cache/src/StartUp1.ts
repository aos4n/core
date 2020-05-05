import { StartUp } from '../../../bin';
import { Component1 } from './components/Component1';

@StartUp()
export class StartUp1 {
    constructor(private readonly c1: Component1) { }
}