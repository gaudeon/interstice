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

    fn.prototype.getBulletType = function () { return this.config.player.bullet; };

    // current values
    fn.prototype.setHullHealthCur = function (health) { this.attributes.health = health; };
    fn.prototype.getHullHealthCur = function () { return this.attributes.health; };

    // load assets
    fn.prototype.loadAssets = function () {
        var player_hull_asset = this.config.assets.player.hulls[this.attributes.hull_class_id];
        this.game.load.image(player_hull_asset.key, player_hull_asset.file);

        var player_thrust_sound = this.config.assets.player.sounds.thrust;
        this.game.load.audio(player_thrust_sound.key, player_thrust_sound.file);

        var player_bullet_sound = this.config.assets.player.sounds.bullet;
        this.game.load.audio(player_bullet_sound.key, player_bullet_sound.file);
    };

    // setup player sound effects and music
    fn.prototype.setupAudio = function () {
        // audio
        this.audio = {};
        this.audio.thrustSound = this.game.add.audio(this.config.assets.player.sounds.thrust.key);
        this.audio.bulletSound = this.game.add.audio(this.config.assets.player.sounds.bullet.key);

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
    fn.prototype.setupShip = function () {
        // add ship to the game
        this.game.add.existing(this.getShip());

        // Define constants
        this.SHOT_DELAY = 100; // milliseconds (10 bullets/second)
        this.BULLET_SPEED = 500; // pixels/second
        this.NUMBER_OF_BULLETS = 20;

        // Create an object pool of bullets
        this.bulletPool = this.game.add.group();
        for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
            // Create each bullet and add it to the group.
            var bullet = new App.Bullet(game, this);
            this.bulletPool.add(bullet);
        }
    };

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

    fn.prototype.tick = function () {
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

        if (this.keyboard.fireBullets.isDown) {
            this.audio.bulletSound.play();
            this.shootBullet();
        }
    }

    fn.prototype.shootBullet = function() {
        // Enforce a short delay between shots by recording
        // the time that each bullet is shot and testing if
        // the amount of time since the last shot is more than
        // the required delay.
        if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
        if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
        this.lastBulletShotAt = this.game.time.now;

        // Get a dead bullet from the pool
        var bullet = this.bulletPool.getFirstDead();

        // If there aren't any bullets available then don't shoot
        if (bullet === null || bullet === undefined) return;

        // Revive the bullet
        // This makes the bullet "alive"
        bullet.revive();

        // Bullets should kill themselves when they leave the world.
        // Phaser takes care of this for me by setting this flag
        // but you can do it yourself by killing the bullet if
        // its x,y coordinates are outside of the world.
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;

        // Set the bullet position to the gun position.
        bullet.reset(this.ship.x, this.ship.y);
        bullet.rotation = this.ship.rotation;

        var forward_rotation = this.ship.rotation - this.game.math.PI2 / 4;

        // Shoot it in the right direction
        bullet.body.velocity.x = Math.cos(forward_rotation) * this.BULLET_SPEED;
        bullet.body.velocity.y = Math.sin(forward_rotation) * this.BULLET_SPEED;
    };

    return fn;
})();
