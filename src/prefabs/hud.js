// namespace
var App = App || {};

App.HUD = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;
    };

    fn.prototype.loadAssets = function () {
        this.game.load.image('bluePanel', 'assets/images/hud_elements/metalPanel_blue.png');
    };

    fn.prototype.displayHUD = function () {
        this.group = this.game.add.group();
        this.fixedToCamera = true;

        this.bluePanel = this.game.add.sprite(0, 0, 'bluePanel');
        this.bluePanel.fixedToCamera = true;
        this.group.add(this.bluePanel);
    };

    return fn;
})();
