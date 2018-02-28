import Mission from '../mission';
import KillShipsObjective from '../objectives/kill_ships';

export default class KillMinionsMission extends Mission {
    constructor (game) {
        super(game, "kill_minions");
    }

    setupMission () {
        // call parent's function first
        super.setupMission();

        // now setup success and failure objectives for this mission
        var minions = [];
        this.sector.getBots().forEach(bot => {
            if (bot.isEnemy(this.sector.getPlayer()) && bot.alive) {
                minions.push(bot);
            }
        });

        var kill_minions = new KillShipsObjective(this.game, minions);

        this.addSuccessObjective('kill_minions', kill_minions);

        var player_killed = new KillShipsObjective(this.game, this.sector.getPlayer());

        this.addFailureObjective('player_killed', player_killed);
    }
};
