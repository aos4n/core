import { Config, Typed } from '../../../../bin';

@Config()
export class Config1 {
    f1: string

    f2: number

    @Typed
    f3: number
}

@Config('f4')
export class Config2 {
    f5: number
}