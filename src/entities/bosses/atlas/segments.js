import BossSegments from '../../boss/segments';
import AtlasFrontSegment from './segments/front_segment';
import AtlasLeftSegment from './segments/left_segment';
import AtlasRightSegment from './segments/right_segment';
import AtlasBackSegment from './segments/back_segment';

export default class AtlasSegments extends BossSegments {
    constructor (boss) {
        super(boss);

        this.front = new AtlasFrontSegment(this);
        this.displayList.add(this.front);

        this.left = new AtlasLeftSegment(this);
        this.displayList.add(this.left);

        this.right = new AtlasRightSegment(this);
        this.displayList.add(this.right);

        this.back = new AtlasBackSegment(this);
        this.displayList.add(this.back);
    }
}