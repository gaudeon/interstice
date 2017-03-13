var App = App || {};

App.KillShipsObjective = (function () {
    "use strict";

    var fn = function (game, ships) {
        App.Objective.call(this, game);

        if (!Array.isArray(ships)) {
            ships = [ships];
        }

        this.bots = _.filter(ships, (function (o) {
            return o.alive;
        }).bind(this));

        this.ships = ships;
    };

    fn.prototype = Object.create(App.Objective.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.isComplete = function () {
        var all_dead = true;

        for (var i = 0; i < this.ships.length; i++) {
            if (this.ships[i].alive) {
                all_dead = false;
                break;
            }
        }

        return all_dead;
    };

    return fn;
})();
