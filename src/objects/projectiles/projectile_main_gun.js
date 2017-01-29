// namespace
var App = App || {};

App.ProjectileMainGun = (function () {
    "use strict";

    var fn = function (game, x, y) {
        // config data
        this.config = {};
        this.config.assets = game.cache.getJSON('assetsConfig');

        var key = this.config.assets.bullets.red.key;

        // call bullet constructor
        App.Projectile.call(this, game, x, y, key);
    };

    fn.prototype = Object.create(App.Projectile.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
