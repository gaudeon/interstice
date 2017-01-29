// namespace
var App = App || {};

// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas

App.Bullet = (function () {
    "use strict";

    var fn = function (game, x, y, key, frame) {
        // call bullet constructor
        Phaser.Bullet.call(this, game, x, y, key, frame);

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;

        // Set its pivot point to the center of the bullet
        this.anchor.setTo(0.5, 0.5);
    };

    fn.prototype = Object.create(Phaser.Bullet.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.update = function () {
        if (this.alive) {
            // TODO: Redesign weapons using my own classes and use P2 physics since Arcade and P2 physics don't mesh very well...
            // check for overlap on enemies group.
            /*this.game.physics.arcade.overlap(this,this.game.global.enemies,(function () { // this breaks because minions are p2 bodys and their bodies don't have a getBounds function
                this.kill();
            }).bind(this));*/
        }
    };

    return fn;
})();
