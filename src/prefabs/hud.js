// namespace
var App = App || {};

App.HUD = (function () {
    "use strict";

    var fn = function (game, state) {
        this.game  = game;
        this.state = state;
    };

    fn.prototype.loadAssets = function () {
        this.state.load.image('bluePanel', 'assets/images/hud_elements/metalPanel_blue.png');
    };

    fn.prototype.draw = function() {
        this.bluePanel = this.state.add.sprite(0, 0, 'bluePanel');
        this.bluePanel.anchor.setTo(0.5);
        this.bluePanel.scale.setTo(0.5);
    };

    return fn;
})();
