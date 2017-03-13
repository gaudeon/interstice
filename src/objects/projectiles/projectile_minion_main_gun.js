// namespace
var App = App || {};

App.ProjectileMinionMainGun = (function () {
    "use strict";

    var fn = function (game, x, y, collision_manager) {
        // config data
        this.config = {};
        this.config.assets = game.cache.getJSON('assetsConfig');
        this.config.bots   = game.cache.getJSON('botsConfig');

        var key = this.config.assets.bullets.red.key;

        // setup this projectiles attributes
        this.attributes = {};
        this.attributes.damage   = this.config.bots.minion.main_gun.bullet_damage;
        this.attributes.lifespan = this.config.bots.minion.main_gun.bullet_lifespan;
        this.attributes.mass     = this.config.bots.minion.main_gun.bullet_mass;

        // call bullet constructor
        App.Projectile.call(this, game, x, y, key, null, collision_manager);

        if (this.config.assets.bullets.red.in_atlas) {
            this.frameName = this.config.assets.bullets.red.frame;
        }

        // setup collisions
        this.collision_manager.addToEnemyProjectilesCG(this);
        this.collision_manager.setCollidesWithPlayersCG(this);
        this.collision_manager.setCollidesWithSectorCG(this);
        this.collision_manager.addCallbackForPlayersCG(this, function (my_body, player_body) {
            player_body.sprite.damage(this.attributes.damage);
            this.kill();
        }, this);
        this.collision_manager.addCallbackForPlayerProjectilesCG(this, function (my_body, player_body) {
            this.kill();
        }, this);
    };

    fn.prototype = Object.create(App.Projectile.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
