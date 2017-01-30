// namespace
var App = App || {};

App.ProjectileMainGun = (function () {
    "use strict";

    var fn = function (game, x, y) {
        // config data
        this.config = {};
        this.config.assets = game.cache.getJSON('assetsConfig');

        var key = this.config.assets.bullets.green.key;

        // call bullet constructor
        App.Projectile.call(this, game, x, y, key);

        // setup collisions
        this.game.global.collision_manager.addToPlayerProjectilesCG(this);
        this.game.global.collision_manager.setCollidesWithEnemiesCG(this);
        this.game.global.collision_manager.setCollidesWithEnemyProjectilesCG(this);
    };

    fn.prototype = Object.create(App.Projectile.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
