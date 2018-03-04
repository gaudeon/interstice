import BossSegment from '../../../boss/segment';

export default class AtlasFrontSegment extends BossSegment {
    constructor (segments) {
        super(segments, -48, -144, "game_atlas", "atlasSegFront");

        this.setOrigin(0,0);
    }
}