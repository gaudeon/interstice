// namespace
var App = App || {};

App.Bullet = (function () {
    "use strict";

    var fn = function (game, owner) {
        // cache game and player objects
        this.game   = game;
        this.owner  = owner;

        // config data
        this.config = {};
        this.config.assets   = this.game.cache.getJSON('assetsConfig');

        // call sprite constructor
        var bullet_asset = this.config.assets.bullets[this.owner.getBulletType()];
        Phaser.Sprite.call(this, game, 0, 0, bullet_asset.key);

        this.game  = game;

        // Set its pivot point to the center of the bullet
        this.anchor.setTo(0.5, 0.5);

        // Enable physics on the bullet
        game.physics.p2.enable(this, false);

        // Set its initial state to "dead".
        this.kill();
    };

    fn.prototype = Object.create(Phaser.Sprite.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
