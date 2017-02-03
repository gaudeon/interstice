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
        this.hud = new App.HUD(this.game);

        // config
        this.config = {};
        this.config.assets = game.cache.getJSON('assetsConfig');
        this.config.bots   = this.game.cache.getJSON('botsConfig');

        this.mission_assets = this.config.assets.missions.default;

        this.sector = {
            name: "Test Sector",
            width: this.game.world.width * 2,
            height: this.game.world.height * 2
        };

        // create a shorter accessor to the player object
        this.player = this.game.global.player;
    };

    fn.prototype.preload = function () {
        // player assets
        this.player.loadAssets();

        // bullet assets
        _.each(_.keys(this.config.assets.bullets), (function (bullet_type) {
            var bullet_asset = this.config.assets.bullets[bullet_type];
            this.load.image(bullet_asset.key, bullet_asset.file);
        }).bind(this));

        // mission assets
        var background_asset = this.mission_assets.background;
        this.load.image(background_asset.key, background_asset.file);

        // bot assets TODO: only load bot assets we use on a stage
        _.each(_.keys(this.config.bots), (function (bot_class_id) {
            var bot_asset_config = this.config.assets.bots[bot_class_id];
            this.load.image(bot_asset_config.key, bot_asset_config.file);
        }).bind(this));

        // hud assets
        this.hud.loadAssets();
    };

    fn.prototype.create = function () {
        // setup world boundaries
        this.game.global.collision_manager.setBounds(0, 0, this.sector.width, this.sector.height);

        // background
        this.background = this.add.tileSprite(0, 0, this.sector.width, this.sector.height, this.mission_assets.background.key);

        // setup player ship
        this.player.setupShip();

        this.player_ship = this.player.getShip();

        this.player_ship.body.onBeginContact.add(this.contactHandler, this);

        // setup a random group of enemys
        this.minions = [];
        this.game.global.enemies = new Phaser.Group(this.game);
        for (var m = 0; m < this.game.rnd.integerInRange(1,5); m++) {
            this.game.global.enemies.add(this.add.existing(new App.Bots.Minion(this.game, this.game.rnd.integerInRange(50, this.game.world.width - 50), this.game.rnd.integerInRange(50, this.game.world.height - 50))));
        }

        // hud
        this.hud.setupHUD();
    };

    fn.prototype.contactHandler = function (body, shape1, shape2, equation) {
        var x = 0;
        var y = 0;

        if (body && body !== 'null' && body !== 'undefined') {
            x = body.velocity.x;
            y = body.velocity.y;
        }

        var v1 = new Phaser.Point(this.player_ship.body.velocity.x, this.player_ship.body.velocity.y);
        var v2 = new Phaser.Point(x, y);

        var xdiff = Math.abs(v1.x - v2.x);
        var ydiff = Math.abs(v1.y - v2.y);

        var damage = 0;
        if (xdiff > 500 || ydiff > 500) { //Massive damage!
            damage = 20;
        } else if (xdiff > 200 || ydiff > 200) { //Slight damage
            damage = 10;
        }

        var curEnergy = this.player.getEnergy();
        var curHealth = this.player.getHealth();

        var remaining_damage = curEnergy < damage ? damage - curEnergy : 0;

        // damage energy shield first then player health
        this.player.setEnergy(curEnergy - damage + remaining_damage);
        this.player.setHealth(curHealth - remaining_damage);
    }

    fn.prototype.update = function () {
        this.player.tick();

        this.game.global.enemies.forEach(function (enemy) {
            enemy.tick();
        }, this);

        this.hud.tick();
    }

    return fn;
})();
