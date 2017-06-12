export default class Projectile {
    constructor (game, x, y, key, frame, collision_manager) {
        // call bullet constructor
        super(game, x, y, key, frame);

        // the collision manager
        this.collision_manager = collision_manager;

        // project attributes
        this.attributes = this.attributes || {};
        this.attributes.mass = this.attributes.mass || 1; // get project mass from children or default to 1

        // enable physics
        game.physics.p2.enable(this, false);

        // physics settings
        this.body.fixedRotation = true;
        this.body._collideWorldBounds = false; // project bodies die when they go out of bounds
        this.body.mass = this.attributes.mass;

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;

        // Set its pivot point to the center of the bullet
        this.anchor.setTo(0.5, 0.5);

        // save start position
        this.startX = x;
        this.startY = y;

        // default bullets as dead
        this.kill();
    }
};
