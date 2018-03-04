import BossSegment from '../../../boss/segment';

export default class AtlasLeftSegment extends BossSegment {
    constructor (segments) {
        super(segments, -96, -48, "game_atlas", "atlasSegLeftThrust");

        this.setOrigin(0,0);
    }
}