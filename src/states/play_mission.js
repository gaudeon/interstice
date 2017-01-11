// namespace
var App = App || {};

App.PlayMissionState = (function () {
    "use strict";

    var fn = function (game) {
        Phaser.State.call(this, game);
    };

    fn.prototype = Object.create(Phaser.State.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.init = function () {
    };

    fn.prototype.preload = function () {
        // console.log(this.game);
        this.load.image('space', 'assets/images/spaceBGDarkPurple.png');
    };

    fn.prototype.create = function () {
        this.background = this.add.tileSprite(0, 0, this.game.world.width * 2, this.game.world.height * 2, 'space');
    };

    return fn;
})();
