export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, key, frame) {
        // call bullet constructor
        super(scene, x, y, key, frame);

        // project attributes
        this.attributes = this.attributes || {};
        this.attributes.mass = this.attributes.mass || 1; // get projectile mass from children or default to 1
        this.attributes.bounce = this.attributes.bounce || 1; // get projectile bounce from children or default to 1

        // add to physics engine and scene
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

        this.setBounce(this.attributes.bounce);
        this.setMass(this.attributes.mass);
        this.setCollideWorldBounds(true); // project bodies die when they go out of bounds

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        

        // Set its pivot point to the center of the bullet
        this.setOrigin(0.5, 0.5);

        // save start position
        this.startX = x;
        this.startY = y;

        // default bullets as dead
        this.kill(false);
    }

    setBounce (bounce) {
        this.attributes.bounce = bounce;
        super.setBounce(bounce);
    }

    setMass (mass) {
        this.attributes.mass = mass;
        super.setMass(mass);
    }

    get alive () { return this.active; }

    set alive (isAlive) { this.active = !!isAlive; }

    kill (emitEvent = true) {
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false; // stop the physics body also when a projectile is killed so it doesn't update

        if (emitEvent) {
            this.emit('killed');
        }
    }

    revive () {
        this.age = 0;

        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true; // re-enable the physics body when a projectile is revived

        this.emit('alive');
    }

    reset (x, y) {
        this.setPosition(x, y);
        this.revive();
    }

    update (time, delta) {
        this.age += delta;

        if (this.lifespan !== undefined && this.age > this.lifespan) {
            this.kill();
        }
    }
};
