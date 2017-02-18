// namespace
var App = App || {};

App.PlayMissionState = (function () {
    "use strict";

    var fn = function (game) {
        Phaser.State.call(this, game);
    };

    fn.prototype = Object.create(Phaser.State.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.init = function () {
        // config
        this.config = {};
        this.config.assets = game.cache.getJSON('assetsConfig');
        this.config.bots   = this.game.cache.getJSON('botsConfig');

        // setup collision manager for p2 physics collisions
        this.gcm = this.game.global.collision_manager = new App.CollisionManager(this.game);

        // setup player object
        this.player = this.game.global.player = new App.Player(this.game);

        // setup the sector object
        this.sector = new App.Sector(this.game, this.player, this.gcm, 'sector_1');

        // setup hud
        this.hud = new App.HUD(this.game);
    };

    fn.prototype.preload = function () {
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

        // hud assets
        this.hud.loadAssets();
    };

    fn.prototype.create = function () {
        // setup sector
        this.sector.setupSector();

        // hud
        this.hud.setupHUD();
    };

    fn.prototype.update = function () {
        this.sector.tick();

        this.hud.tick();

        if (!this.player.alive) {
            this.state.start('MainMenu');
        }
    }

    return fn;
})();
