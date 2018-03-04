import BossSegment from '../../../boss/segment';

export default class AtlasBackSegment extends BossSegment {
    constructor (segments) {
        super(segments, -48, 48, "game_atlas", "atlasSegRearRest");

        this.setOrigin(0,0);
    }
}