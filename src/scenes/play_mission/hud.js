// HUD
import HUD from '../../ui/hud';

export default class PlayMissionHudScene extends Phaser.Scene {
    constructor () {
        super({ key: 'PlayMissionHud' });
    }

    init (parentScene) {
        console.log(this);

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
    }

    update () {
        this.hud.update(); // since the hud isn't a part of this scenes update list... yet
    }
};
