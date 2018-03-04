import BossSegments from './boss/segments';

export default class Boss extends Phaser.Physics.Arcade.Image {
    constructor (sector, x, y) {
       super(sector.scene, x, y); 

       // the image itself isn't visible, it's segments are
       this.setVisible(false);

       // overwrite segmentClass in the actual boss class to give the correct segments class to us
       let SegmentsClass = this.segmentsClass();
       this.segments = new SegmentsClass(this);

       // let's keep track of our sector
       this.sector = sector;
    }

    segmentsClass () { return BossSegments; }
}