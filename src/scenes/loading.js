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

export default class LoadingScene extends Phaser.Scene {
    constructor (config, key = 'Loading') {
        super({ key: key });
    }

    init () {
        // font loading
        this.are_fonts_loaded = false;
    }

    preload () {
        // load json configuration files
        this.cache.json.add('assetsConfig', assetsConfig);
        this.cache.json.add('controlsConfig', controlsConfig);
        this.cache.json.add('mainMenuConfig', mainMenuConfig);
        this.cache.json.add('playerConfig', playerConfig);
        this.cache.json.add('botsConfig', botsConfig);
        this.cache.json.add('hudConfig', hudConfig);
        this.cache.json.add('sectorsConfig', sectorsConfig);
        this.cache.json.add('missionsConfig', missionsConfig);
        this.cache.json.add('tilemapSector1', tilemapSector1);
        this.cache.json.add('atlasGame', atlasGame);

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

    webfontloaded () {
        this.are_fonts_loaded = true;
    }

    update () {
        if (this.are_fonts_loaded) {
            this.input.stopPropagation();
            this.scene.switch('MainMenu');
        }
    }
};
