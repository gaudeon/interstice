// HUD
import HUD from '../../ui/hud';

export default class PlayMissionHudScene extends Phaser.Scene {
    constructor () {
        super({ key: 'PlayMissionHud' });
    }

    init (parentScene) {
        this.parentScene = parentScene;

        // setup hud
        this.hud = new HUD(this, parentScene.mission);
    }

    preload () {
        // hud assets
        this.hud.loadAssets();
    }

    create () {
        // hud
        this.hud.setupHUD();

        // define what happens when player successfully completes mission
        this.parentScene.mission.events.on('MissionSuccess', () => {
            this.input.stopPropagation();
            this.scene.setVisible(false);
            this.scene.stop();
        });

        // define what happens when a player fails to complete a mission
        this.parentScene.mission.events.on('MissionFailure', () => {
            this.input.stopPropagation();
            this.scene.setVisible(false);
            this.scene.stop();
        });
    }

    update () {
        if (this.scene.isVisible()) {
            this.hud.update(); // since the hud isn't a part of this scenes update list... yet
        }
    }
};
