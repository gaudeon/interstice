export default class BossSegment extends Phaser.Physics.Arcade.Sprite {
    constructor (segments, x, y, texture, frame) {
        super(segments.boss.scene, x, y, texture, frame);

        this._x = x;
        this._y = y;

        this.segments = segments;
        this.boss = segments.boss;
        this.scene = segments.boss.scene;
    }

    get x () { return this.boss.x + this._x; }

    get y () { return this.boss.y + this._y; }

    set x (newX) { }

    set y (newY) { }
}