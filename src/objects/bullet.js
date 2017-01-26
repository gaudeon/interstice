// namespace
var App = App || {};

// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas

App.Bullet = (function () {
    "use strict";

    var fn = function (game, x, y, key, frame) {
        // call bullet constructor
        Phaser.Bullet.call(this, game, x, y, key, frame);

        // Set its pivot point to the center of the bullet
        this.anchor.setTo(0.5, 0.5);
    };

    fn.prototype = Object.create(Phaser.Bullet.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.update = function () {
        if (this.alive) {
            // TODO: fix bullets not dying at world bounds bug
            // check for overlap on enemies group.
        }
    };

    return fn;
})();
