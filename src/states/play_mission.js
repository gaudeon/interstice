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
        this.load.image('space', 'assets/images/spaceBGDarkPurple.png');
        this.load.image('player', 'assets/images/playerShipO.png');
    };

    fn.prototype.create = function () {
        this.background = this.add.tileSprite(0, 0, this.game.world.width * 2, this.game.world.height * 2, 'space');

        this.player = this.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'player');
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(0.5);
    };

    return fn;
})();
