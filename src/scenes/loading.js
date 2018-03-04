// json configuration
import assetsConfig from '../config/assets.json';
import controlsConfig from '../config/controls.json';
import mainMenuConfig from '../config/main_menu.json';
import playerConfig from '../config/player.json';
import botsConfig from '../config/bots.json';
import sectorsConfig from '../config/sectors.json';
import missionsConfig from '../config/missions.json';
import bossesConfig from '../config/bosses.json';

// web fonts
import WebFont from 'webfontloader';
require('../../assets/css/fonts.css');
require('../../assets/fonts/Exo2-SemiBold.ttf');

// require external asset files so webpack pulls them into dist
require('../../assets/sounds/thrust.wav');
require('../../assets/sounds/bullet.wav');
require('../../assets/sounds/ship_explosion.wav');
require('../../assets/images/scenery_tileset.png');
require('../../assets/images/sector_tileset.png');
require('../../assets/images/game_atlas.png');
require('../../assets/json/game_atlas.json');
require('../../assets/json/sector_1.json')

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
        this.cache.json.add('missionsConfig', missionsConfig);
        this.cache.json.add('playerConfig', playerConfig);
        this.cache.json.add('botsConfig', botsConfig);
        this.cache.json.add('sectorsConfig', sectorsConfig);
        this.cache.json.add('bossesConfig', bossesConfig);

        // load web fonts
        WebFont.load({
            active: () => {
                this.webfontloaded();
            },
            custom: {
                families: ['Exo2 SemiBold'],
                urls: ['fonts.css']
            }
        });
    }

    webfontloaded () {
        this.are_fonts_loaded = true;
    }

    update () {
        if (this.are_fonts_loaded) {
            this.input.stopPropagation();
            this.scene.start('MainMenu');
        }
    }
};
