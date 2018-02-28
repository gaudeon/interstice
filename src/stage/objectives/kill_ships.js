import Objective from '../objective';

export default class KillShipsObjective extends Objective {
    constructor (game, ships) {
        super(game);

        if (!Array.isArray(ships)) {
            ships = [ships];
        }

        this.bots = _.filter(ships, ship => { return ship.alive; });

        this.ships = ships;
    }

    isComplete () {
        var all_dead = true;

        for (var i = 0; i < this.ships.length; i++) {
            if (this.ships[i].alive) {
                all_dead = false;
                break;
            }
        }

        return all_dead;
    }
};
