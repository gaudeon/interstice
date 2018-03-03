export default class BossSegment extends Phaser.Physics.Arcade.Sprite {
    constructor (segments, x, y, texture, frame) {
        super(segments.boss.scene, x, y, texture, frame);

        this.segments = segments;
        this.scene = segments.boss.scene;

        this.scene.add.existing(this);
    }
}