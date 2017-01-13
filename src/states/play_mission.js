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

        this.bots_config = this.game.cache.getJSON('botsConfig');

        this.sector = {
            name: "Test Sector",
            width: this.game.world.width * 2,
            height: this.game.world.height * 2
        };

        // create a shorter accessor to the player object
        this.player = this.game.global.player;
    };

    fn.prototype.preload = function () {
        // Run Bullet preloads once
        var bullet = new App.Bullet(this.game);
        bullet.loadAssets();

        // image assets
        this.load.image('space_bg_image', 'assets/images/spaceBGDarkPurple.png');
        this.load.image('player_ship_image', this.player.getHullAsset().file);

        // bot assets TODO: only load bot assets we use on a stage
        var image_key_prefix = this.game.cache.getJSON('assetsConfig').bot_image_key_prefix;
        _.each(_.keys(this.bots_config), (function (bot_class_id) {
            this.load.image(image_key_prefix + bot_class_id, this.bots_config[bot_class_id].asset.file);
        }).bind(this));

        // audio assets
        this.game.load.audio('thrust', 'assets/sounds/thrust.wav');

        // hud assets
        this.hud.loadAssets();
    };

    fn.prototype.create = function () {
        // background
        this.background = this.add.tileSprite(0, 0, this.sector.width, this.sector.height, 'space_bg_image');
        this.game.world.setBounds(0, 0, this.sector.width, this.sector.height);

        // setup player ship spite
        this.player_ship = this.player.getShip(); // easier accessor to player ship sprite
        this.add.existing(this.player_ship);

        this.player_ship.body.onBeginContact.add(this.contactHandler, this);

        this.player_ship.events.onCollide.add(function () { console.log(arguments); });

        // setup a random group of enemys
        this.minions = [];
        for (var m = 0; m < this.game.rnd.integerInRange(1,5); m++) {
            this.minions.push(this.add.existing(new App.Bots.Minion(this.game, this.game.rnd.integerInRange(50, this.game.world.width - 50), this.game.rnd.integerInRange(50, this.game.world.height - 50))));
        }

        // hud
        this.hud.displayHUD();

        this.keyboard = this.game.input.keyboard.createCursorKeys();
        this.keyboard.space = this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        // Audio
        var thrustSound = this.game.add.audio('thrust');
        this.keyboard.up.onDown.add(function() {
            thrustSound.play();
        });
        this.keyboard.up.onUp.add(function() {
            thrustSound.stop();
        });
        this.keyboard.down.onDown.add(function() {
            thrustSound.play();
        });
        this.keyboard.down.onUp.add(function() {
            thrustSound.stop();
        });
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
        if (this.keyboard.space.onDown) {
            // this.firing = true;
            // this.bullet.create('Green Laser');
            // this.firing = true;
        }

        if (this.keyboard.up.isDown) {
            this.player_ship.body.thrust(this.player.getHullThrust());
        }
        else if (this.keyboard.down.isDown) {
            this.player_ship.body.reverse(this.player.getHullThrust());
        }

        if (this.keyboard.left.isDown) {
            this.player_ship.body.rotateLeft(this.player.getHullRotation());
        }
        else if (this.keyboard.right.isDown) {
            this.player_ship.body.rotateRight(this.player.getHullRotation());
        }
        else {
            this.player_ship.body.setZeroRotation();
        }

        for (var m = 0; m < this.minions.length; m++) {
            this.minions[m].move();
        }
    }

    return fn;
})();
