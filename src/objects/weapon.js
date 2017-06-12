// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas

export default class Weapon {
    constructor (game, collision_manager) {
        this.game = game;

        this.collision_manager = collision_manager;

        // projectile Group
        this.projectilePool = this.game.add.group();

        // the class type of the projectile fired
        this.projectileClass = App.Projectile;

        // the default amount of projectiles created
        this.projectileCount = 20;

        // delay between shots
        this.shotDelay = 100;

        // a sprite targeted as the origin of the projectile
        this.originSprite = null;

        // how fast does a projectile travel in pixles per second
        this.projectileSpeed = 100;

        // offset angle (in degrees) around the orgin Sprite (in case bullet comes out an an undesired angle from the origin sprite)
        this.projectileAngleOffset = 0;

        // setup event signals
        this.events = {};
        this.events.onFire = new Phaser.Signal();
    }

    createProjectiles (quantity) {
        this.projectilePool.removeAll(true); // clear out old list of projectiles
        this.lastProjectileShotAt = null; // reset last time projectile was shot

        quantity = quantity || this.projectCount; // default quantity if not supplied

        this.projectileCount = quantity; // update projectileCount

        // Create an object pool of bullets
        for(var i = 0; i < this.projectileCount; i++) {
            // Create each bullet and add it to the group.
            var projectile = new this.projectileClass(this.game, 0, 0, this.collision_manager);
            this.projectilePool.add(projectile);
        }
    }

    trackSprite (target) {
        this.originSprite = target;
    }

    fire (speed) {
        speed = speed || this.projectileSpeed;

        // Enforce a short delay between shots by recording
        // the time that each projectile is shot and testing if
        // the amount of time since the last shot is more than
        // the required delay.
        if (this.lastProjectileShotAt === undefined) this.lastProjectileShotAt = 0;
        if (this.game.time.now - this.lastProjectileShotAt < this.shotDelay) {
            return;
        }
        this.lastProjectileShotAt = this.game.time.now;

        // Get a dead projectile from the pool
        var projectile = this.projectilePool.getFirstDead();

        // If there aren't any projectiles available then don't shoot
        if (projectile === null || projectile === undefined) {
                return;
        }

        // Revive the projectile
        projectile.revive();

        // sprites are on top
        this.game.world.bringToTop(projectile);

        // set projectile lifespan
        if (projectile.attributes.lifespan) {
            projectile.lifespan = projectile.attributes.lifespan;
        }

        // Set the projectile position to the gun position.
        if (this.originSprite) {
            projectile.reset(this.originSprite.x, this.originSprite.y);

            projectile.rotation = this.originSprite.rotation;

            var forward_rotation = this.originSprite.rotation - this.game.math.degToRad(this.projectileAngleOffset);

            // Shoot it in the right direction
            projectile.body.velocity.x = Math.cos(forward_rotation) * speed;
            projectile.body.velocity.y = Math.sin(forward_rotation) * speed;
        }
        else {
            projectile.reset(projectile.startX, projectile.startY);

            console.log('firing without a originSprite is not yet implemented.');
        }

        this.events.onFire.dispatch(true);
    }
};
