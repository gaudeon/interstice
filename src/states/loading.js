// json configuration
import assetsConfig from '../../assets/json/assets.json';
import controlsConfig from '../../assets/json/controls.json';
import mainMenuConfig from '../../assets/json/main_menu.json';
import playerConfig from '../../assets/json/player.json';
import botsConfig from '../../assets/json/bots.json';
import hudConfig from '../../assets/json/hud.json';
import sectorsConfig from '../../assets/json/sectors.json';
import missionsConfig from '../../assets/json/missions.json';
import tilemapSector1 from '../../assets/json/tilemaps/sector_1.json';
import atlasGame from '../../assets/json/game_atlas.json';

// web fonts
import WebFont from 'webfontloader';
require('../../assets/css/fonts.css');
require('../../assets/fonts/Exo2-SemiBold.ttf');

// require asset files so webpack pulls them into dist
require('../../assets/sounds/thrust.wav');
require('../../assets/sounds/bullet.wav');
require('../../assets/sounds/ship_explosion.wav');
require('../../assets/json/tilemaps/sector_1.json');
require('../../assets/images/scenery_tileset.png');
require('../../assets/images/sector_tileset.png');
require('../../assets/images/game_atlas.png');

export default class LoadingState extends Phaser.State {
    init () {
        // font loading
        this.are_fonts_loaded = false;

        // var loadingText = "Loading..."; # no need, loads to fast
        var loadingText = '';

        var text = this.add.text(0, 0, loadingText, {
            font: 'Helvetica, Arial, Sans-Serif',
            fill: '#ffffff',
            fontSize: 48,
            boundsAlignH: 'center',
            boundsAlignV: 'middle'
        });

        text.setTextBounds(0, 0, this.world.width, this.world.height);
    }

    preload () {
        // load json configuration files
        this.game.cache.addJSON('assetsConfig', null, assetsConfig);
        this.game.cache.addJSON('controlsConfig', null, controlsConfig);
        this.game.cache.addJSON('mainMenuConfig', null, mainMenuConfig);
        this.game.cache.addJSON('playerConfig', null, playerConfig);
        this.game.cache.addJSON('botsConfig', null, botsConfig);
        this.game.cache.addJSON('hudConfig', null, hudConfig);
        this.game.cache.addJSON('sectorsConfig', null, sectorsConfig);
        this.game.cache.addJSON('missionsConfig', null, missionsConfig);
        this.game.cache.addJSON('tilemapSector1', null, tilemapSector1);
        this.game.cache.addJSON('atlasGame', null, atlasGame);

        // load web fonts
        WebFont.load({
            active: () => {
                this.webfontloaded();
            },
            custom: {
                families: ['Exo2 SemiBold'],
                urls: ['/assets/fonts.css']
            }
        });
    }

    create () {
        // use p2 for ships
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.restitution = 0.8;

        // use arcade physics for weapons
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    }

    webfontloaded () {
        this.are_fonts_loaded = true;
    }

    update () {
        if (this.are_fonts_loaded) {
            this.state.start('MainMenu');
        }
    }
};
