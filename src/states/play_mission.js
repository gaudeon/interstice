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
        // background
        this.background = this.add.tileSprite(0, 0, this.sector.width, this.sector.height, this.mission_assets.background.key);
        this.game.world.setBounds(0, 0, this.sector.width, this.sector.height);

        // setup player audio
        this.player.setupAudio();

        // setup player ship
        this.player.setupShip();

        this.player_ship = this.player.getShip();

        this.player_ship.body.onBeginContact.add(this.contactHandler, this);

        this.player_ship.events.onCollide.add(function () {
            // something hit the ship
            // console.log(arguments);
        });


        // setup a random group of enemys
        this.minions = [];
        for (var m = 0; m < this.game.rnd.integerInRange(1,5); m++) {
            this.minions.push(this.add.existing(new App.Bots.Minion(this.game, this.game.rnd.integerInRange(50, this.game.world.width - 50), this.game.rnd.integerInRange(50, this.game.world.height - 50))));
        }

        // hud
        this.hud.displayHUD();
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

        var curhealth = this.player.getHullHealthCur();
        if (xdiff > 500 || ydiff > 500) { //Massive damage!
            this.player.setHullHealthCur(curhealth - 20);
            this.hud.displayHUD();
        } else if (xdiff > 200 || ydiff > 200) { //Slight damage
            this.player.setHullHealthCur(curhealth - 10);
            this.hud.displayHUD();
        }
    }

    fn.prototype.update = function () {
        this.player.tick();

        for (var m = 0; m < this.minions.length; m++) {
            this.minions[m].tick();
        }
    }

    return fn;
})();
