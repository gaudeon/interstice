var App = App || {};

App.KillMinionsMission = (function () {
    "use strict";

    var fn = function (game) {
        this.key = "kill_minions";

        App.Mission.call(this, game);

        // todo - setup objectives
    };

    fn.prototype = Object.create(App.Mission.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
