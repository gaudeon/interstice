// namespace
var App = App || {};

// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas

App.WeaponMinionMainGun = (function () {
    "use strict";

    var fn = function (game, collision_manager) {
        // call bullet constructor
        App.Weapon.call(this, game, collision_manager);

        // config data
        this.config = {};
        this.config.bots = game.cache.getJSON('botsConfig');

        // set our projectile to the main gun projectile
        this.projectileClass = App.ProjectileMinionMainGun;

        // the default amount of projectiles created
        this.projectileCount = this.config.bots.minion.main_gun.bullet_pool_count;

        // delay between shots
        this.shotDelay = this.config.bots.minion.main_gun.bullet_shot_delay;

        // how fast does a projectile travel in pixles per second
        this.projectileSpeed = this.config.bots.minion.main_gun.bullet_speed;

        // offset angle (in degrees) around the orgin Sprite (in case bullet comes out an an undesired angle from the origin sprite)
        this.projectileAngleOffset = this.config.bots.minion.main_gun.bullet_angle_offset;
    };

    fn.prototype = Object.create(App.Weapon.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
