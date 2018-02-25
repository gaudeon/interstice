export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, key, frame) {
        // call bullet constructor
        super(scene, x, y, key, frame);

        // project attributes
        this.attributes = this.attributes || {};
        this.attributes.mass = this.attributes.mass || 1; // get project mass from children or default to 1

        // add to physics engine and scene
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

        //this.body._collideWorldBounds = false; // project bodies die when they go out of bounds
        this.setMass(this.attributes.mass);

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        // this.checkWorldBounds = true; V3 REPLACEMENT?
        // this.outOfBoundsKill = true; V3 REPLACEMENT?

        // Set its pivot point to the center of the bullet
        this.setOrigin(0.5, 0.5);

        // save start position
        this.startX = x;
        this.startY = y;

        // default bullets as dead
        this.kill();
    }

    setMass (mass) {
        this.attributes.mass = mass;
        super.setMass(mass);
    }

    kill () {
        this.setActive(false);
    }

    revive () {
        this.setActive(true);
    }
};
