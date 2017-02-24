// namespace
var App = App || {};

App.ProjectilePlayerMainGun = (function () {
    "use strict";

    var fn = function (game, x, y) {
        // config data
        this.config = {};
        this.config.assets = game.cache.getJSON('assetsConfig');
        this.config.player = game.cache.getJSON('playerConfig');

        var key = this.config.assets.bullets.green.key;

        // setup this projectiles attributes
        this.attributes = {};
        this.attributes.damage   = this.config.player.main_gun.bullet_damage;
        this.attributes.lifespan = this.config.player.main_gun.bullet_lifespan;
        this.attributes.mass     = this.config.player.main_gun.bullet_mass;

        // call bullet constructor
        App.Projectile.call(this, game, x, y, key);

        if (this.config.assets.bullets.green.in_atlas) {
            this.frameName = this.config.assets.bullets.green.frame;
        }

        // setup collisions
        this.gcm = this.game.global.collision_manager;
        this.gcm.addToPlayerProjectilesCG(this);
        this.gcm.setCollidesWithEnemiesCG(this);
        this.gcm.setCollidesWithSectorCG(this);
        this.gcm.addCallbackForEnemiesCG(this, function (my_body, enemy_body) {
            enemy_body.sprite.damage(this.attributes.damage);
            this.kill();
        }, this);
        this.gcm.addCallbackForEnemyProjectilesCG(this, function (my_body, player_body) {
            this.kill();
        }, this);
    };

    fn.prototype = Object.create(App.Projectile.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
