// missions
import KillMinionsMission from '../stage/missions/kill_minions';

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
        this.mission.events.on('MissionSuccess', () => {
            this.input.stopPropagation();
            this.scene.start('MainMenu');
        });

        // define what happens when a player fails to complete a mission
        this.mission.events.on('MissionFailure', () => {
            this.input.stopPropagation();
            this.scene.start('MainMenu');
        });
    }

    update () {
        this.mission.tick();

        //this.hud.tick();
    }

    matterAddExisting (object) {
        if (object instanceof Phaser.Physics.Matter.Sprite) {
            this.sys.displayList.add(object);
            this.sys.updateList.add(object);
        }
    }
};
