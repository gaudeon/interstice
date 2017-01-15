// namespace
var App = App || {};

App.Player = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;

        // config data
        this.config = {};
        this.config.assets   = this.game.cache.getJSON('assetsConfig');
        this.config.controls = this.game.cache.getJSON('controlsConfig');
        this.config.player   = this.game.cache.getJSON('playerConfig');

        // player attributes
        this.attributes = {};

        // default to balanced hull class. TODO: Change me to support player chosen hull classes
        this.attributes.hull_class_id = "balanced";
        this.attributes.health = this.getHullHealth();

        // keyboard events
        this.keyboard               = this.game.input.keyboard.createCursorKeys();
        this.keyboard.thrustForward = this.game.input.keyboard.addKey(Phaser.KeyCode[this.config.controls.thrustForward]);
        this.keyboard.thrustReverse = this.game.input.keyboard.addKey(Phaser.KeyCode[this.config.controls.thrustReverse]);
        this.keyboard.rotateLeft    = this.game.input.keyboard.addKey(Phaser.KeyCode[this.config.controls.rotateLeft]);
        this.keyboard.rotateRight   = this.game.input.keyboard.addKey(Phaser.KeyCode[this.config.controls.rotateRight]);
        this.keyboard.fireBullets   = this.game.input.keyboard.addKey(Phaser.KeyCode[this.config.controls.fireBullets]);
    };

    // hull
    fn.prototype.getHullConfig       = function () { return this.config.player.hulls[this.attributes.hull_class_id]; }
    fn.prototype.getHullId           = function () { return this.attributes.hull_class_id; };
    fn.prototype.getHullName         = function () { return this.getHullConfig().name; };
    fn.prototype.getHullEnergy       = function () { return this.getHullConfig().energy; };
    fn.prototype.getHullHealth       = function () { return this.getHullConfig().health; };
    fn.prototype.getHullThrust       = function () { return this.getHullConfig().thrust; };
    fn.prototype.getHullRotation     = function () { return this.getHullConfig().rotation; };
    fn.prototype.getHullSpriteConfig = function () { return this.getHullConfig().sprite; };

    // current values
    fn.prototype.setHullHealthCur = function (health) { this.attributes.health = health; };
    fn.prototype.getHullHealthCur = function () { return this.attributes.health; };

    // load assets
    fn.prototype.loadAssets = function () {
        var player_hull_asset = this.config.assets.player.hulls[this.attributes.hull_class_id];
        this.game.load.image(player_hull_asset.key, player_hull_asset.file);

        this.game.load.audio('thrust', 'assets/sounds/thrust.wav');
    };

    // setup player sound effects and music
    fn.prototype.setupAudio = function () {
        // audio
        this.audio = {};
        this.audio.thrustSound = this.game.add.audio('thrust');

        // audio events
        this.keyboard.thrustForward.onDown.add((function() {
            this.audio.thrustSound.play();
        }).bind(this));
        this.keyboard.thrustForward.onUp.add((function() {
            this.audio.thrustSound.stop();
        }).bind(this));
        this.keyboard.thrustReverse.onDown.add((function() {
            this.audio.thrustSound.play();
        }).bind(this));
        this.keyboard.thrustReverse.onUp.add((function() {
            this.audio.thrustSound.stop();
        }).bind(this));
    };

    // ship
    fn.prototype.getShip = function () {
        if ('undefined' !== typeof this.ship) return this.ship;

        this.ship = new App.PlayerShip(this.game, this);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        this.game.camera.follow(this.ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        return this.ship;
    };

    fn.prototype.move = function () {
        if (this.keyboard.thrustForward.isDown) {
            this.ship.body.thrust(this.getHullThrust());
        }
        else if (this.keyboard.thrustReverse.isDown) {
            this.ship.body.reverse(this.getHullThrust());
        }

        if (this.keyboard.rotateLeft.isDown) {
            this.ship.body.rotateLeft(this.getHullRotation());
        }
        else if (this.keyboard.rotateRight.isDown) {
            this.ship.body.rotateRight(this.getHullRotation());
        }
        else {
            this.ship.body.setZeroRotation();
        }
    }

    return fn;
})();
