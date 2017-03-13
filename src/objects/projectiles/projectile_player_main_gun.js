// namespace
var App = App || {};

App.ProjectilePlayerMainGun = (function () {
    "use strict";

    var fn = function (game, x, y, collision_manager) {
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
        App.Projectile.call(this, game, x, y, key, null, collision_manager);

        if (this.config.assets.bullets.green.in_atlas) {
            this.frameName = this.config.assets.bullets.green.frame;
        }

        // setup collisions
        this.collision_manager.addToPlayerProjectilesCG(this);
        this.collision_manager.setCollidesWithEnemiesCG(this);
        this.collision_manager.setCollidesWithSectorCG(this);
        this.collision_manager.addCallbackForEnemiesCG(this, function (my_body, enemy_body) {
            enemy_body.sprite.damage(this.attributes.damage);
            this.kill();
        }, this);
        this.collision_manager.addCallbackForEnemyProjectilesCG(this, function (my_body, player_body) {
            this.kill();
        }, this);
    };

    fn.prototype = Object.create(App.Projectile.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
