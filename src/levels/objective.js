var App = App || {};

App.Objective = (function () {
    "use strict";

    var fn = function (game) {
        // config data
        this.config = this.config || {};

        this._game = game;
    };

    fn.prototype.isComplete = function () {
        return true;
    };

    return fn;
})();
