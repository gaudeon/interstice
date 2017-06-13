import CollisionManager from '../objects/collision_manager';
import Player from '../entities/ships/player';
import Sector from '../map/sector';

export default class Mission {
    constructor (game, key) {
        this.game = game;
        this.key = key;

        // config data
        this.config = this.config || {};
        this.config.missions = game.cache.getJSON('missionsConfig');
        this.config.assets = game.cache.getJSON('assetsConfig');
        this.config.bots = game.cache.getJSON('botsConfig');

        // mission keys should be defined in any child object inheriting from this object
        if (typeof this.key === 'undefined' || typeof this.config.missions[this.key] === 'undefined') {
            throw new Error('mission key is not defined');
        }

        this.config.mission = this.config.missions[this.key];

        // setup collision manager for p2 physics collisions
        this.collision_manager = new CollisionManager(game);

        // setup player object
        this.player = new Player(game, this.collision_manager);

        // setup the sector object
        this.sector = new Sector(game, this.player, this.collision_manager, this.config.mission.start_sector);

        this.success_objectives = {};
        this.failure_objectives = {};

        // setup event signals
        this.events = {};
        this.events.onSuccess = new Phaser.Signal();
        this.events.onFailure = new Phaser.Signal();
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
                this.game.load.atlas(atlasAsset.key, atlasAsset.file, null, this.game.cache.getJSON(atlasAsset.jsonKey), Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
            }
        );

        // sector assets
        this.sector.loadAssets();

        // player assets
        this.player.loadAssets();

        // bullet assets
        _.each(_.keys(this.config.assets.bullets), function (bulletType) {
            const BULLET_ASSET_KEY = 'bullet_' + bulletType;
            let bulletAsset = this.config.assets[BULLET_ASSET_KEY];
            if (!bulletAsset.in_atlas) {
                this.load.image(bulletAsset.key, bulletAsset.file);
            }
        }.bind(this));

        // bot assets TODO: only load bot assets we use on a stage
        _.each(_.keys(this.config.bots), function (botClassId) {
            const BOTS_ASSET_KEY = 'bot_' + botClassId;
            let botAssetConfig = this.config.assets[BOTS_ASSET_KEY];
            if (!botAssetConfig.in_atlas) {
                this.load.image(botAssetConfig.key, botAssetConfig.file);
            }
        }.bind(this));
    }

    setupMission () {
        // setup sector
        this.sector.setupSector();
    }

    tick () {
        this.sector.tick();

        if (this.isMissionSuccess()) {
            this.events.onSuccess.dispatch();
        }

        if (this.isMissionFailure()) {
            this.events.onFailure.dispatch();
        }
    }

    getPlayer () { return this.player; }

    getSector () { return this.sector; }

    getCollisionManager () { return this.collision_manager; }

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
