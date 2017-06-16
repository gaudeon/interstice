// load json config for game
import assetsConfig from '../assets/json/assets.json';
import controlsConfig from '../assets/json/controls.json';
import mainMenuConfig from '../assets/json/main_menu.json';
import playerConfig from '../assets/json/player.json';
import botsConfig from '../assets/json/bots.json';
import hudConfig from '../assets/json/hud.json';
import sectorsConfig from '../assets/json/sectors.json';
import missionsConfig from '../assets/json/missions.json';
import tilemapSector1 from '../assets/json/tilemaps/sector_1.json';
import atlasGame from '../assets/json/game_atlas.json';

// jsdom / canvas
import JSDOM from 'jsdom';
import Canvas from 'canvas';
import fs from 'fs';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

global.Image = Canvas.Image; // phaser needs Image in global

// virutal dom - with dom globals :(
global.window = JSDOM.jsdom().defaultView;
global.document = window.document;
global.navigator = window.navigator;
global.Element = window.Element; // phaser needs Element in global
global.HTMLElement = window.HTMLElement; // phaser needs Element in global

// Phaser needs a rendering context
global.window.CanvasRenderingContext2D = new Canvas(GAME_WIDTH, GAME_HEIGHT).getContext('2d');

// moar globals :( - so the code we are test can properly extend from these external libraries
global.PIXI = require('../node_modules/phaser-ce/build/custom/pixi').PIXI;
global.p2 = require('../node_modules/phaser-ce/build/custom/p2');
global.Phaser = require('../node_modules/phaser-ce/build/phaser').Phaser;

let gameReadyPromise = new Promise((resolve, reject) => {
    let game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.HEADLESS);

    game.device.whenReady(() => {
        // game.world = new Phaser.World(game);

        game.physics.startSystem(Phaser.Physics.P2JS);

        game.cache.addJSON('assetsConfig', null, assetsConfig);
        game.cache.addJSON('controlsConfig', null, controlsConfig);
        game.cache.addJSON('mainMenuConfig', null, mainMenuConfig);
        game.cache.addJSON('playerConfig', null, playerConfig);
        game.cache.addJSON('botsConfig', null, botsConfig);
        game.cache.addJSON('hudConfig', null, hudConfig);
        game.cache.addJSON('sectorsConfig', null, sectorsConfig);
        game.cache.addJSON('missionsConfig', null, missionsConfig);
        game.cache.addJSON('tilemapSector1', null, tilemapSector1);
        game.cache.addJSON('atlasGame', null, atlasGame);

        resolve(game);
    });
}).then((game) => {
    return new Promise((resolve, reject) => {
        // manually load sprite asset
        var img, json;

        fs.readFile('./assets/images/game_atlas.png', 'base64', function (err, data) {
            if (err) {
                reject(err);
            }

            img = data;

            fs.readFile('./assets/json/game_atlas.json', 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }

                json = JSON.parse(data);

                game.cache.addTextureAtlas('game_atlas', './assets/images/game_atlas.png', 'data:image/png;base64,' + img, json, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
                resolve(game);
            });
        });
    });
}).catch((err) => { throw err; });

export default {
    'gameReady': gameReadyPromise
};
