// namespace
var App = App || {};

App.Bullet = (function () {
    "use strict";

    var fn = function (game, x, y, key, frame) {
        // cache game and player objects
        this.game   = game;

        // call sprite constructor

        Phaser.Bullet.call(this, game, x, y, key, frame);

        this.game  = game;

        // Set its pivot point to the center of the bullet
        this.anchor.setTo(0.5, 0.5);
    };

    fn.prototype = Object.create(Phaser.Bullet.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
