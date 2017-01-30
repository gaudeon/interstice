// namespace
var App = App || {};

App.Projectile = (function () {
    "use strict";

    var fn = function (game, x, y, key, frame) {
        // call bullet constructor
        Phaser.Sprite.call(this, game, x, y, key, frame);

        // enable physics
        game.physics.p2.enable(this, false);

        // physics settings
        this.body.fixedRotation = true;
        this.body._collideWorldBounds = false; // project bodies die when they go out of bounds

        // Set its pivot point to the center of the bullet
        this.anchor.setTo(0.5, 0.5);

        // save start position
        this.startX = x;
        this.startY = y;

        // default bullets as dead
        this.kill();
    };

    fn.prototype = Object.create(Phaser.Sprite.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
