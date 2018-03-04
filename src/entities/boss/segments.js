import BossSegment from './segment';

export default class BossSegments {
    constructor (boss) {
        this.boss = boss;

        this.scene = boss.scene;

        // list of segment keys
        this.segmentList = [];
    }

    addSegment (key, segment) {
        if (this[key]) {
            throw Error('Cannot add new segment as key ' + key + '. Key already exists.');
        }

        this[key] = segment;

        this.segmentList.push(segment);
    }

    getSegment (key) {
        if (!this[key] || !(this[key] instanceof BossSegment)) {
            throw Error('Could not find requested segment, ' + key);
        } 

        return this[key];
    }

    // physics collisions for target and each segment of the boss
    addCollider (target) {
        this.segmentList.forEach(segment => {
            segment.addCollider(target);
        });
    }
}