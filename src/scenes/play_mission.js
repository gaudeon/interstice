// missions
import L1KillAtlasMission from '../stage/missions/l1_kill_atlas';

const MissionDictionary = {
    'l1_kill_atlas' : L1KillAtlasMission
};

export default class PlayMissionScene extends Phaser.Scene {
    constructor () {
        super({ key: 'PlayMission' });
    }

    init (mission) {
        this.hudScene = this.scene.get('PlayMissionHud'); // save player hud scene for later use

        // load mission
        let MissionClass = MissionDictionary[mission];
        if (typeof MissionClass === 'undefined') {
            throw Error('Failed to find mission with key ' + mission);
        }

        this.mission = new MissionClass(this);
    }

    preload () {
        // mission assets
        this.mission.loadAssets();
    }

    create () {
        // mission
        this.mission.setupMission();

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

        // TODO uncomment this when scene launch bug for non-running scenes is fixed
        //this.scene.launch('PlayMissionHud', this); // Load the HUD which is a scene layered on top of this scene
    }

    update () {
        // TODO remove the below if block when scene launch bug for non-running scenes is fixed
        if (this.sys.settings.active && !this.hudScene.scene.isActive()) {
            this.scene.launch('PlayMissionHud', this);
        }
    }
};
