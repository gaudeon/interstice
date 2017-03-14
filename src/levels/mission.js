var App = App || {};

App.Mission = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;

        // config data
        this.config          = this.config || {};
        this.config.missions = game.cache.getJSON('missionsConfig');
        this.config.assets   = game.cache.getJSON('assetsConfig');
        this.config.bots     = game.cache.getJSON('botsConfig');

        // mission keys should be defined in any child object inheriting from this object
        if ("undefined" === typeof this.key || "undefined" === typeof this.config.missions[this.key]) {
            throw "mission key is not defined";
        }

        this.config.mission = this.config.missions[this.key];

        // setup collision manager for p2 physics collisions
        this.collision_manager = new App.CollisionManager(game);

        // setup player object
        this.player = new App.Player(game, this.collision_manager);

        // setup the sector object
        this.sector = new App.Sector(game, this.player, this.collision_manager, this.config.mission.start_sector);

        this.success_objectives = {};
        this.failure_objectives = {};

        // setup event signals
        this.events = {};
        this.events.onSuccess = new Phaser.Signal();
        this.events.onFailure = new Phaser.Signal();
    };

    fn.prototype.loadAssets = function () {
        // load image atlases so everything else can use them
        _.each(_.keys(this.config.assets.atlases), (function (key) {
            var atlas_asset = this.config.assets.atlases[key];
            this.game.load.atlas(atlas_asset.key, atlas_asset.file, atlas_asset.json, Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
        }).bind(this));

        // sector assets
        this.sector.loadAssets();

        // player assets
        this.player.loadAssets();

        // bullet assets
        _.each(_.keys(this.config.assets.bullets), (function (bullet_type) {
            var bullet_asset = this.config.assets.bullets[bullet_type];
            if (!bullet_asset.in_atlas) {
                this.load.image(bullet_asset.key, bullet_asset.file);
            }
        }).bind(this));

        // bot assets TODO: only load bot assets we use on a stage
        _.each(_.keys(this.config.bots), (function (bot_class_id) {
            var bot_asset_config = this.config.assets.bots[bot_class_id];
            if (!bot_asset_config.in_atlas) {
                this.load.image(bot_asset_config.key, bot_asset_config.file);
            }
        }).bind(this));
    };

    fn.prototype.setupMission = function () {
        // setup sector
        this.sector.setupSector();
    };

    fn.prototype.tick = function () {
        this.sector.tick();

        if (this.isMissionSuccess()) {
            this.events.onSuccess.dispatch();
        }

        if (this.isMissionFailure()) {
            this.events.onFailure.dispatch();
        }
    };

    fn.prototype.getPlayer = function () { return this.player; };

    fn.prototype.getSector = function () { return this.sector; };

    fn.prototype.getCollisionManager = function () { return this.collision_manager; };

    fn.prototype.addSuccessObjective = function (key, objective) {
        if ("undefined" === typeof objective || "function" !== typeof objective.isComplete) {
            throw "invalid objectitve";
        }

        this.success_objectives[key] = objective;
    };

    fn.prototype.addFailureObjective = function (key, objective) {
        if ("undefined" === typeof objective || "function" !== typeof objective.isComplete) {
            throw "invalid objectitve";
        }

        this.failure_objectives[key] = objective;
    };

    fn.prototype.getSuccessObjective = function (key) {
        return this.success_objectives[key];
    };

    fn.prototype.getFailureObjective = function (key) {
        return this.failure_objectives[key];
    };

    fn.prototype.isMissionSuccess = function () {
        // it's not successful if there are not objectives
        if (Object.keys(this.success_objectives).length < 1) {
            return false;
        }

        var all_objectives_successful = true;

        for (var key in this.success_objectives) {
            if (!this.success_objectives[key].isComplete()) {
                all_objectives_successful = false;
                break;
            }
        }

        return all_objectives_successful;
    };

    fn.prototype.isMissionFailure = function () {
        // it's not successful if there are not objectives
        if (Object.keys(this.failure_objectives).length < 1) {
            return false;
        }

        var all_objectives_failure = true;

        for (var key in this.failure_objectives) {
            if (!this.failure_objectives[key].isComplete()) {
                all_objectives_failure = false;
                break;
            }
        }

        return all_objectives_failure;
    };

    return fn;
})();
