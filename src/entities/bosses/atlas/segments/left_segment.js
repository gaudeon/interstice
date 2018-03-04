import BossSegment from '../../../boss/segment';

export default class AtlasLeftSegment extends BossSegment {
    constructor (segments) {
        super(segments, 0, -48, "game_atlas", "atlasSegLeftThrust");
    }
}