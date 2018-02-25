import Sector from './sector';

export default class Mission extends Phaser.GameObjects.Group {
    constructor (scene, key) {
        super(scene);

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

        // setup the sector object
        this.sector = new Sector(scene, this.config.mission.start_sector);

        this.success_objectives = {};
        this.failure_objectives = {};

        // setup events
        this.events = new Phaser.EventEmitter();

        this.scene.add.existing(this); // add ourself to the scene updateList
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

        // bullet assets
        _.filter(Object.keys(this.config.assets), key => { return key.match(/^bullet_/); }).forEach(bulletType => {
            let bulletAsset = this.config.assets[bulletType];
            if (!bulletAsset.in_atlas) {
                this.scene.load.image(bulletAsset.key, bulletAsset.file);
            }
        });

        // sound assets
        _.filter(Object.keys(this.config.assets), key => { return key.match(/^sound_/); }).forEach(sound => {
            let soundAsset = this.config.assets[sound];
            if (!soundAsset.in_atlas) {
                this.scene.load.audio(soundAsset.key, soundAsset.file);
            }
        });

        // player assets
        _.each(['balanced'], (classId) => {
            const PLAYER_CHASIS_CLASS = 'player_chasis_' + classId;
            let playerChasisAsset = this.config.assets[PLAYER_CHASIS_CLASS];
            if (!playerChasisAsset.in_atlas) {
                this.scene.load.image(playerChasisAsset.key, playerChasisAsset.file);
            }
        });

        // bot assets TODO: only load bot assets we use on a stage
        Object.keys(this.config.bots).forEach(botClassId => {
            const BOTS_ASSET_KEY = 'bot_' + botClassId;
            let botAssetConfig = this.config.assets[BOTS_ASSET_KEY];
            if (!botAssetConfig.in_atlas) {
                this.scene.load.image(botAssetConfig.key, botAssetConfig.file);
            }
        });

        // sector assets
        this.sector.loadAssets();
    }

    setupMission () {
        // setup sector
        this.sector.setupSector();
    }

    // we want to be updated since we added ourselves into the updateList...
    preUpdate (time, delta) {
        if (super.preUpdate !== undefined) {
            super.preUpdate(time, delta);
        }

        if (this.isMissionSuccess()) {
            this.events.emit('MissionSuccess');
        }

        if (this.isMissionFailure()) {
            this.events.emit('MissionFailure');
        }
    }

    getPlayer () { return this.sector.getPlayer(); }

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
