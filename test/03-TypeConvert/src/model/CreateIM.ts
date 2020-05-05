import { Typed, TypedArray } from '../../../../bin';

export class ContactInfo {
    @Typed
    name: string

    @Typed
    address: string
}

export class EmailInfo {
    @Typed
    id: number

    @Typed
    address: string
}

export class CreateIM {
    @Typed
    name: string

    @Typed
    age: number

    @TypedArray(String)
    imgs: string[]

    @Typed
    contactInfo: ContactInfo

    @TypedArray(EmailInfo)
    emailInfos: EmailInfo[]

    @Typed
    remark: string = 'empty text'

    @Typed
    enabled: boolean = true

    @Typed
    grade: number = 1
}

export class UpdateIM {
    @Typed
    id: number

    @Typed
    name: string
}