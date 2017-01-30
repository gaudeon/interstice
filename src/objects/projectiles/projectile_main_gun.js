// namespace
var App = App || {};

App.ProjectileMainGun = (function () {
    "use strict";

    var fn = function (game, x, y) {
        // config data
        this.config = {};
        this.config.assets = game.cache.getJSON('assetsConfig');
        this.config.player = game.cache.getJSON('playerConfig');

        var key = this.config.assets.bullets.green.key;

        // call bullet constructor
        App.Projectile.call(this, game, x, y, key);

        // setup this projectiles attributes
        this.attributes = {};
        this.attributes.damage = this.config.player.main_gun.bullet_damage;

        // setup collisions
        this.cgm = this.game.global.collision_manager;
        this.cgm.addToPlayerProjectilesCG(this);
        this.cgm.setCollidesWithEnemiesCG(this);
        this.cgm.setCollidesWithEnemyProjectilesCG(this);
        this.cgm.addCallbackForEnemiesCG(this, function (my_body, enemy_body) {
            enemy_body.sprite.damage(this.attributes.damage);
            this.kill();
        }, this);
    };

    fn.prototype = Object.create(App.Projectile.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
