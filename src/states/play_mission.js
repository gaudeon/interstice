// missions
import KillMinionsMission from '../levels/missions/kill_minions';

// HUD
import HUD from '../ui/hud';

const MissionDictionary = {
    'KillMinions': KillMinionsMission
};

export default class PlayMissionState extends Phaser.State {
    init (mission) {
        // for now default mission to KillMinionsMission
        if (typeof mission === 'undefined') {
            mission = 'KillMinions';
        }

        // load mission
        let MissionClass = MissionDictionary[mission];
        if (typeof MissionClass === 'undefined') {
            MissionClass = MissionDictionary['KillMinions'];
        }

        this.mission = new MissionClass(this.game);

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
        this.mission.events.onSuccess.add(() => {
            this.state.start('MainMenu');
        });

        // define what happens when a player fails to complete a mission
        this.mission.events.onFailure.add(() => {
            this.state.start('MainMenu');
        });
    }

    update () {
        this.mission.tick();

        this.hud.tick();
    }
};
