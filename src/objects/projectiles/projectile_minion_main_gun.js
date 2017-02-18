// namespace
var App = App || {};

App.ProjectileMinionMainGun = (function () {
    "use strict";

    var fn = function (game, x, y) {
        // config data
        this.config = {};
        this.config.assets = game.cache.getJSON('assetsConfig');
        this.config.bots   = game.cache.getJSON('botsConfig');

        var key = this.config.assets.bullets.red.key;

        // call bullet constructor
        App.Projectile.call(this, game, x, y, key);

        if (this.config.assets.bullets.red.in_atlas) {
            this.frameName = this.config.assets.bullets.red.frame;
        }

        // setup this projectiles attributes
        this.attributes = {};
        this.attributes.damage   = this.config.bots.minion.main_gun.bullet_damage;
        this.attributes.lifespan = this.config.bots.minion.main_gun.bullet_lifespan;

        // setup collisions
        this.gcm = this.game.global.collision_manager;
        this.gcm.addToEnemyProjectilesCG(this);
        this.gcm.setCollidesWithPlayersCG(this);
        this.gcm.setCollidesWithPlayerProjectilesCG(this);
        this.gcm.setCollidesWithSectorCG(this);
        this.gcm.addCallbackForPlayersCG(this, function (my_body, player_body) {
            player_body.sprite.damage(this.attributes.damage);
            this.kill();
        }, this);
        this.gcm.addCallbackForPlayerProjectilesCG(this, function (my_body, player_body) {
            this.kill();
        }, this);
    };

    fn.prototype = Object.create(App.Projectile.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
