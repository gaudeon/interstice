import 'phaser';
import 'lodash';
import 'webfontloader';

require('./index.html'); // so we get it in the dist

import LoadingScene from './scenes/loading';
import MainMenuScene from './scenes/main_menu';
import PlayMissionScene from './scenes/play_mission';
import PlayMissionHudScene from './scenes/play_mission/hud';
import MissionResultsScene from './scenes/mission_results';
import MissionsScene from './scenes/missions';

var gameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true, // enable to see physics bodies outlined
        }
    }, 
    scene: [LoadingScene, MainMenuScene, PlayMissionScene, PlayMissionHudScene, MissionResultsScene, MissionsScene]
};

let game = new Phaser.Game(gameConfig);
