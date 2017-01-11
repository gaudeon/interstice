// namespace
var App = App || {};

App.MainMenuState = (function () {
    "use strict";

    var fn = function (game) {
        Phaser.State.call(this, game);
    };

    fn.prototype = Object.create(Phaser.State.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.init = function () {
        this.config = this.game.cache.getJSON('mainMenuConfig');

        _.each(this.config.items, (function (item) {
            var text = this.add.text(0, 0, item.label, this.config.style);

            text.setTextBounds(0,0,this.world.width,this.world.height);

            text.inputEnabled = true;

            text.events.onInputUp.add(function (ev) {
                this.state.start('PlayMission');
            }, this);
        }).bind(this));
    };

    return fn;
})();
