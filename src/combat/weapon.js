// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas
import Projectile from './projectile';

export default class Weapon extends Phaser.Physics.Arcade.Group {
    constructor (scene) {
        super(scene.physics.world, scene, [], {
            runChildUpdate: true
        });

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

        // list of colliders that tracks the objects that can collide with the projectiles from this weapon
        this.colliders = [];

        this.events = new Phaser.EventEmitter();
    }

    on (...args) {
        return this.events.on.apply(this.events, args);
    }

    emit (...args) {
        return this.events.emit.apply(this.events, args);
    }

    // the class type of the projectile fired
    projectileClass () { return Projectile; }

    createProjectiles (quantity) {
        this.clear(true); // clear out old list of projectiles
        this.lastProjectileShotAt = null; // reset last time projectile was shot

        quantity = quantity || this.projectCount; // default quantity if not supplied

        this.projectileCount = quantity; // update projectileCount

        // Create an object pool of bullets
        for (var i = 0; i < this.projectileCount; i++) {
            // Create each bullet and add it to the group.
            let ProjectileClass = this.projectileClass();
            let projectile = new ProjectileClass(this.scene, 0, 0);
            this.add(projectile, true); // add projectile and add to scene
        }
    }

    trackSprite (target) {
        this.originSprite = target;
    }

    fire (speed) {
        if (!this.originSprite) {
            console.log('firing without a originSprite is not yet implemented.');
            return;
        }
        speed = speed || this.projectileSpeed;

        // Enforce a short delay between shots by recording
        // the time that each projectile is shot and testing if
        // the amount of time since the last shot is more than
        // the required delay.
        if (this.lastProjectileShotAt === undefined) this.lastProjectileShotAt = 0;
        if (this.scene.time.now - this.lastProjectileShotAt < this.shotDelay) {
            return;
        }
        this.lastProjectileShotAt = this.scene.time.now;

        // Get a dead projectile from the pool
        var projectile = this.getFirstDead();

        // If there aren't any projectiles available then don't shoot
        if (projectile === null || projectile === undefined) {
            projectile = this.getOldestAlive();

            if (projectile === null || projectile === undefined) {
                return;
            }
        }

        // Revive the projectile
        projectile.revive();

        // set projectile lifespan
        if (projectile.attributes.lifespan) {
            projectile.lifespan = projectile.attributes.lifespan;
        }

        // Set the projectile position to the gun position.
        this.scene.physics.velocityFromRotation(this.originSprite.rotation, speed, projectile.body.velocity);
        projectile.setVelocity(
            // ship velocity + calculated project velocity
            projectile.body.velocity.x + this.originSprite.body.velocity.x,
            projectile.body.velocity.y + this.originSprite.body.velocity.y
        );
        let bounds = this.originSprite.getBounds();
        projectile.reset(bounds.centerX, bounds.centerY);
        console.log('Firing from ' + bounds.centerX + ',' + bounds.centerY);
        console.log(projectile);

        this.emit('fire');
    }

    getOldestAlive () {
        return _.reduce(this.getChildren(), (oldest, current) => { return oldest === undefined || (current.alive && current.age > oldest.age) ? current : oldest; });
    }

    addCollider (target) {
        let colliderCallback = () => {};

        let children = [target];
        // process all children in a group as separate colliders
        if (target.getChildren) {
            children = target.getChildren();
        }

        children.forEach(child => {
            // this child of the group can take damage
            if (typeof child.takeDamage === 'function') {
                colliderCallback = (obj1, obj2) => {
                    let projectile = obj1 == child ? obj2 : obj1;
                    child.takeDamage(projectile.attributes.damage);
                    projectile.kill();
                }
            }

            this.colliders.push(this.scene.physics.add.collider(this, child, colliderCallback));
        });
    }
};
