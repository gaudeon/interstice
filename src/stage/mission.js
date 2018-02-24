import Player from '../entities/ships/player';
import Sector from './sector';

export default class Mission {
    constructor (scene, key) {
        this.scene = scene;
        this.key = key;

        // config data
        this.config = this.config || {};
        this.config.missions = scene.cache.json.get('missionsConfig');
        this.config.assets = scene.cache.json.get('assetsConfig');
        this.config.bots = scene.cache.json.get('botsConfig');

        // mission keys should be defined in any child object inheriting from this object
        if (typeof this.key === 'undefined' || typeof this.config.missions[this.key] === 'undefined') {
            throw new Error('mission key is not defined');
        }

        this.config.mission = this.config.missions[this.key];

        // setup player object
        this.player = new Player(scene);

        // setup the sector object
        this.sector = new Sector(scene, this.player, this.config.mission.start_sector);

        this.success_objectives = {};
        this.failure_objectives = {};

        // setup events
        this.events = new Phaser.EventEmitter();
    }

    loadAssets () {
        // load image atlases so everything else can use them
        _.each(
            _.filter(
                _.keys(this.config.assets),
                (key) => { return key.match(/^atlas_/); }
            ),
            (key) => {
                var atlasAsset = this.config.assets[key];
                this.scene.load.atlas(atlasAsset.key, atlasAsset.imageFile, atlasAsset.jsonFile);
            }
        );

        // sector assets
        this.sector.loadAssets();

        // player assets
        this.player.loadAssets();

        // bullet assets
        _.filter(Object.keys(this.config.assets), key => { return key.match(/^bullet_/); }).forEach(bulletType => {
            let bulletAsset = this.config.assets[bulletType];
            if (!bulletAsset.in_atlas) {
                this.load.image(bulletAsset.key, bulletAsset.file);
            }
        });

        // bot assets TODO: only load bot assets we use on a stage
        Object.keys(this.config.bots).forEach(botClassId => {
            const BOTS_ASSET_KEY = 'bot_' + botClassId;
            let botAssetConfig = this.config.assets[BOTS_ASSET_KEY];
            if (!botAssetConfig.in_atlas) {
                this.load.image(botAssetConfig.key, botAssetConfig.file);
            }
        });
    }

    setupMission () {
        // setup sector
        this.sector.setupSector();
    }

    tick () {
        this.sector.tick();

        if (this.isMissionSuccess()) {
            this.events.emit('MissionSuccess');
        }

        if (this.isMissionFailure()) {
            this.events.emit('MissionFailure');
        }
    }

    getPlayer () { return this.player; }

    getSector () { return this.sector; }

    addSuccessObjective (key, objective) {
        if (typeof objective === 'undefined' || typeof objective.isComplete !== 'function') {
            throw new Error('invalid objective');
        }

        this.success_objectives[key] = objective;
    }

    addFailureObjective (key, objective) {
        if (typeof objective === 'undefined' || typeof objective.isComplete !== 'function') {
            throw new Error('invalid objective');
        }

        this.failure_objectives[key] = objective;
    }

    getSuccessObjective (key) {
        return this.success_objectives[key];
    }

    getFailureObjective (key) {
        return this.failure_objectives[key];
    }

    isMissionSuccess () {
        // it's not successful if there are not objectives
        if (Object.keys(this.success_objectives).length < 1) {
            return false;
        }

        var allObjectivesSuccessful = true;

        for (var key in this.success_objectives) {
            if (!this.success_objectives[key].isComplete()) {
                allObjectivesSuccessful = false;
                break;
            }
        }

        return allObjectivesSuccessful;
    }

    isMissionFailure () {
        // it's not successful if there are not objectives
        if (Object.keys(this.failure_objectives).length < 1) {
            return false;
        }

        var allObjectivesFailure = true;

        for (var key in this.failure_objectives) {
            if (!this.failure_objectives[key].isComplete()) {
                allObjectivesFailure = false;
                break;
            }
        }

        return allObjectivesFailure;
    }
};
