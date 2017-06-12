// web fonts
import WebFont from 'webfontloader';
require('../../assets/css/fonts.css');
require('../../assets/fonts/Exo2-SemiBold.ttf');

// json configuration
import assetsConfig from '../../assets/json/assets.json';
import controlsConfig from '../../assets/json/controls.json';
import mainMenuConfig from '../../assets/json/main_menu.json';
import playerConfig from '../../assets/json/player.json';
import botsConfig from '../../assets/json/bots.json';
import hudConfig from '../../assets/json/hud.json';
import sectorsConfig from '../../assets/json/sectors.json';
import missionsConfig from '../../assets/json/missions.json';

// require assets
_.each(
    _.filter(
        Object.keys(assetsConfig),
        (key) => { return "undefined" !== typeof(assetsConfig[key]['file']); }
    ),
    (key) => {
        require('../../' + assetsConfig[key]['file']);
    }
);

export default class LoadingState extends Phaser.State {
    constructor (game) {
        super(game);
    }

    init () {
        // font loading
        this.are_fonts_loaded = false;

        //var loading_text = "Loading..."; # no need, loads to fast
        var loading_text = "";

        var text = this.add.text(0, 0, loading_text, {
            font: "Helvetica, Arial, Sans-Serif",
            fill: "#ffffff",
            fontSize: 48,
            boundsAlignH: "center",
            boundsAlignV: "middle"
        });

        text.setTextBounds(0,0,this.world.width,this.world.height);
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

        // load web fonts
        WebFont.load({
            active: (function () {
                this.webfontloaded();
            }).bind(this),
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
