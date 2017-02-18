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

        this.background = this.config.assets.backgrounds.dark_purple;

        this.sector = new App.Sector(this.game, 'sector_1');

        // setup collision manager for p2 physics collisions
        this.gcm = this.game.global.collision_manager = new App.CollisionManager(this.game);

        // setup player object
        this.player = this.game.global.player = new App.Player(this.game);

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

        // setup world boundaries
        this.game.global.collision_manager.setBounds(0, 0, this.sector.widthInPixels(), this.sector.heightInPixels());

        // setup sector tile collisions
        this.sector.setupSectorCollisions();

        // setup player ship
        this.player.setupShip();

        // setup a random group of enemys
        this.minions = [];
        this.game.global.enemies = new Phaser.Group(this.game);
        for (var m = 0; m < this.game.rnd.integerInRange(3,6); m++) {
            this.game.global.enemies.add(this.add.existing(new App.Bots.Minion(this.game, this.game.rnd.integerInRange(50, this.game.world.width - 50), this.game.rnd.integerInRange(50, this.game.world.height - 50))));
        }

        // hud
        this.hud.setupHUD();
    };

    fn.prototype.update = function () {
        this.player.tick();

        this.game.global.enemies.forEach(function (enemy) {
            enemy.tick();
        }, this);

        this.hud.tick();

        if (!this.player.alive) {
            this.state.start('MainMenu');
        }
    }

    return fn;
})();
