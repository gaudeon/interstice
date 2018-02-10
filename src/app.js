import 'phaser';
import 'lodash';
import 'webfontloader';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

let game = new Phaser.Game(config);

function create () {
    console.log('started');
}

/* phaser v2
import LoadingState from './states/loading';
import MainMenuState from './states/main_menu';
import MissionResultsState from './states/mission_results';
import PlayMissionState from './states/play_mission';

require('./index.html');

let game = new Phaser.Game(800, 600);

Phaser.Device.whenReady(function () {
    // plugins
    game.__plugins = game.__plugins || {};

    // add plugins here
    // ...

    // setup global namespace under game for our global data
    game.global = {};

    // states
    game.state.add('Loading', LoadingState);
    game.state.add('MainMenu', MainMenuState);
    game.state.add('PlayMission', PlayMissionState);
    game.state.add('MissionResults', MissionResultsState);

    game.state.start('Loading');
});
*/
