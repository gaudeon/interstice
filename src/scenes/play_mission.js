// missions
import KillMinionsMission from '../levels/missions/kill_minions';

// HUD
import HUD from '../ui/hud';

const MissionDictionary = {
    'KillMinions': KillMinionsMission
};

export default class PlayMissionScene extends Phaser.Scene {
    constructor () {
        super({ key: 'PlayMission' });
    }

    init (mission) {
        console.log(this);
        // for now default mission to KillMinionsMission
        if (typeof mission === 'undefined') {
            mission = 'KillMinions';
        }

        // load mission
        let MissionClass = MissionDictionary[mission];
        if (typeof MissionClass === 'undefined') {
            MissionClass = MissionDictionary['KillMinions'];
        }

        this.mission = new MissionClass(this);

        // setup hud
        this.hud = new HUD(this, this.mission.getPlayer());
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
            console.log('success');
//            this.scene.switch('MainMenu');
        });

        // define what happens when a player fails to complete a mission
        this.mission.events.onFailure.add(() => {
//            this.scene.switch('MainMenu');
            console.log('failure');
        });
    }

    update () {
        this.mission.tick();

        this.hud.tick();
    }

    matterAddExisting (object) {
        if (object instanceof Phaser.Physics.Matter.Sprite) {
            this.sys.displayList.add(object);
            this.sys.updateList.add(object);
        }
    }
};
