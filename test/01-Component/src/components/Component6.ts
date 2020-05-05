import { Autowired, Component } from '../../../../bin';
import { Component5 } from './Component5';

@Component
export class Component6 {
    @Autowired(() => Component5)
    c5: Component5
}