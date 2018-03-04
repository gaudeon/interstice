import BossSegment from '../../../boss/segment';

export default class AtlasBackSegment extends BossSegment {
    constructor (segments) {
        super(segments, -96, 0, "game_atlas", "atlasSegRearRest");

        this.setOrigin(0,0);
    }
}