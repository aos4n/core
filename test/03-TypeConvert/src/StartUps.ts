import { StartUp, Utils } from '../../../bin';
import { CreateIM, UpdateIM } from './model/CreateIM';

@StartUp()
export class StartUp1 {
    getCreateIM() {
        let json = {
            name: 'xiaoyuer',
            age: '17',
            imgs: ['http://abc.com/a.jpg', 'http://abc.com/b.jpg'],
            contactInfo: {
                name: 'huawuque',
                address: '东江路'
            },
            emailInfos: [
                {
                    id: '1',
                    address: 'a@abc.com'
                }
            ],
            otherField: 'test',
            enabled: false,
            grade: null
        }

        let im = Utils.getTypeSpecifiedValue(CreateIM, json)
        return im
    }

    getUpdateIM() {
        let json = {
            id: 'asd',
            name: 'abc'
        }
        let im = Utils.getTypeSpecifiedValue(UpdateIM, json)
        return im
    }
}