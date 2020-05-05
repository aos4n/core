import { Cachable, Component, Utils } from '../../../../bin';

@Component
export class Component1 {
    @Cachable()
    getStartTime() {
        return Date.now()
    }

    @Cachable()
    async getEndTime() {
        await Utils.sleep(10)
        return Date.now()
    }

    @Cachable()
    getCreateTime() {
        return Date.now()
    }

    @Cachable({ maxAge: 100 })
    getUpdateTime() {
        return Date.now()
    }

    @Cachable()
    getRemoveTime() {
        return Date.now()
    }
}