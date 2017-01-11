// namespace
var App = App || {};

App.HUD = (function () {
    "use strict";

    var fn = function (game, state) {
        this.game = game;
        this.state = state;
    };

    fn.prototype.loadAssets = function () {
        console.log('hud preload assets');
    };

    return fn;
})();
