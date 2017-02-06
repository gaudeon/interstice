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

        // set world bounds because playing missions will change it
        this.game.world.setBounds(0,0,800,600);

        var y = 0;
        _.each(this.config.items, (function (item) {
            var text = this.add.text(0, y, item.label, this.config.style);

            text.setTextBounds(0,0,this.world.width,this.world.height);

            if (item.state) {
                text.addColor(this.config.link.color, 0);
                var state = item.state;
                text.inputEnabled = true;

                text.events.onInputUp.add(function (ev) {
                    this.state.start(state);
                }, this);
            }
            else {
                text.addColor(this.config.label.color, 0);
            }

            y += this.config.style.fontSize;
        }).bind(this));
    };

    return fn;
})();
