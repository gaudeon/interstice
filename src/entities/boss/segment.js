export default class BossSegment extends Phaser.Physics.Arcade.Sprite {
    constructor (segments, x, y, texture, frame) {
        super(segments.boss.scene, x, y, texture, frame);

        this._origX = this._x = x;
        this._origY = this._y = y;

        this.segments = segments;
        this.boss = segments.boss;
        this.scene = segments.boss.scene;

        // add this object to physics engine
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

        this.colliders = [];
    }

    get x () { return this.boss.x + this._x; }

    get y () { return this.boss.y + this._y; }

    set x (newX) { }

    set y (newY) { }

    get rotation () { 
        super.rotation = this.boss.rotation; // we use the bosses overall rotation as our rotation

        let centerX = 0, centerY = 0; // since we are relative to the bosses central position we rotate around 0,0

        let distance = Math.max(1, Phaser.Math.Distance.Between(this._origX, this._origY, centerX, centerY));

        var t = this.boss.rotation + Math.atan2(this._origY - centerY, this._origX - centerX);

        this._x = centerX + (distance * Math.cos(t));
        this._y = centerY + (distance * Math.sin(t));

        return super.rotation; // now return our rotation
    }

    set rotation (newRot) { }

    addCollider (target) {
        this.colliders.push(this.scene.physics.add.collider(this, target));
    }
}