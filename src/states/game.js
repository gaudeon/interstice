// namespace
var App = App || {};

App.GameState = (function () {
    "use strict";

    var fn = function (game) {
        Phaser.State.call(this, game);
    };

    fn.prototype = Object.create(Phaser.State.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.init = function () {
    };

    fn.prototype.preload = function () {
    };

    fn.prototype.create = function () {
    };

    return fn;
})();
