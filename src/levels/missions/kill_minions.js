var App = App || {};

App.KillMinionsMission = (function () {
    "use strict";

    var fn = function (game) {
        this.key = "kill_minions";

        App.Mission.call(this, game);
    };

    fn.prototype = Object.create(App.Mission.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.setupMission = function () {
        // call parent's function first
        App.Mission.prototype.setupMission.call(this);

        // now setup success and failure objectives for this mission
        var minions = [];
        this.sector.getBots().forEach((function (bot) {
            if (bot.isEnemy(this.sector.getPlayer()) && bot.alive) {
                minions.push(bot);
            }
        }).bind(this));

        var kill_minions = new App.KillShipsObjective(this.game, minions);

        this.addSuccessObjective('kill_minions', kill_minions);

        var player_killed = new App.KillShipsObjective(this.game, this.sector.getPlayer());

        this.addFailureObjective('player_killed', player_killed);
    }

    return fn;
})();
