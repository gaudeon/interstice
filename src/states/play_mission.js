// missions
import KillMinionsMission from '../levels/missions/kill_minions';

// HUD
import HUD from '../ui/hud';

const MissionDictionary = {
    "KillMinions": KillMinionsMission
};

export default class PlayMissionState extends Phaser.State {
    constructor (game) {
        super(game);
    }

    init (mission) {
        // for now default mission to KillMinionsMission
        if ("undefined" === typeof mission) {
            mission = "KillMinions";
        }

        // load mission
        var mission_object = MissionDictionary[mission];
        if ("undefined" === typeof mission_object) {
            mission_object = MissionDictionary["KillMinions"];
        }

        this.mission = new mission_object(this.game);

        // setup hud
        this.hud = new HUD(this.game, this.mission.getPlayer());
    }

    preload () {
        // mission assets
        this.mission.loadAssets();

        // hud assets
        this.hud.loadAssets();
    }

    create () {
        // mission
        this.mission.setupMission();

        // hud
        this.hud.setupHUD();

        // define what happens when player successfully completes mission
        this.mission.events.onSuccess.add((function () {
            this.state.start('MainMenu');
        }).bind(this));

        // define what happens when a player fails to complete a mission
        this.mission.events.onFailure.add((function () {
            this.state.start('MainMenu');
        }).bind(this));
    }

    update () {
        this.mission.tick();

        this.hud.tick();
    }
};
