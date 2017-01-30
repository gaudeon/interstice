// namespace
var App = App || {};

// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas

App.Weapon = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;

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

        // setup event signals
        this.events = {};
        this.events.onFire = new Phaser.Signal();
    };

    fn.prototype.createProjectiles = function (quantity) {
        this.projectilePool.removeAll(true); // clear out old list of projectiles
        this.lastProjectileShotAt = null; // reset last time projectile was shot

        quantity = quantity || this.projectCount; // default quantity if not supplied

        this.projectileCount = quantity; // update projectileCount

        // Create an object pool of bullets
        for(var i = 0; i < this.projectileCount; i++) {
            // Create each bullet and add it to the group.
            var projectile = new this.projectileClass(this.game, 0, 0);
            this.projectilePool.add(projectile);
        }
    };

    fn.prototype.trackSprite = function (target) {
        this.originSprite = target;
    };

    fn.prototype.fire = function (speed) {
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

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        projectile.checkWorldBounds = true;
        projectile.outOfBoundsKill = true;

        // Set the projectile position to the gun position.
        if (this.originSprite) {
            projectile.reset(this.originSprite.x, this.originSprite.y);

            projectile.rotation = this.originSprite.rotation;

            var forward_rotation = this.originSprite.rotation - Math.PI / 2;

            // Shoot it in the right direction
            projectile.body.velocity.x = Math.cos(forward_rotation) * speed;
            projectile.body.velocity.y = Math.sin(forward_rotation) * speed;
        }
        else {
            projectile.reset(projectile.startX, projectile.startY);

            console.log('firing without a originSprite is not yet implemented.');
        }

        this.events.onFire.dispatch(true);
    };

    return fn;
})();
