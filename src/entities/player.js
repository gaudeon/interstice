// namespace
var App = App || {};

App.Player = (function () {
    "use strict";

    var fn = function (game) {
        Phaser.Group.call(this, game, null, 'player');

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
        this.keyboard = this.game.input.keyboard.createCursorKeys();
        _.each(['thrustForward','thrustReverse','rotateLeft','rotateRight','fireBullets'], (function (control) {
            var keycode = Phaser.KeyCode[this.config.controls[control]];
            this.keyboard[control] = this.game.input.keyboard.addKey(keycode);
        }).bind(this));
    };

    fn.prototype = Object.create(Phaser.Group.prototype);
    fn.prototype.constructor = fn;

    // hull
    fn.prototype.getHullConfig       = function () { return this.config.player.hulls[this.attributes.hull_class_id]; }
    fn.prototype.getHullId           = function () { return this.attributes.hull_class_id; };
    fn.prototype.getHullName         = function () { return this.getHullConfig().name; };
    fn.prototype.getHullEnergy       = function () { return this.getHullConfig().energy; };
    fn.prototype.getHullHealth       = function () { return this.getHullConfig().health; };
    fn.prototype.getHullThrust       = function () { return this.getHullConfig().thrust; };
    fn.prototype.getHullRotation     = function () { return this.getHullConfig().rotation; };
    fn.prototype.getHullSpriteConfig = function () { return this.getHullConfig().sprite; };

    // main gun info
    fn.prototype.getMainGunBulletType        = function () { return this.config.player.main_gun.bullet_type; };
    fn.prototype.getMainGunBulletPoolCount   = function () { return this.config.player.main_gun.bullet_pool_count; };
    fn.prototype.getMainGunBulletAngleOffset = function () { return this.config.player.main_gun.bullet_angle_offset; };
    fn.prototype.getMainGunBulletFireRate    = function () { return this.config.player.main_gun.bullet_fire_rate; };
    fn.prototype.getMainGunBulletSpeed       = function () { return this.config.player.main_gun.bullet_speed; };

    // current values
    fn.prototype.setHullHealthCur = function (health) { this.attributes.health = health; };
    fn.prototype.getHullHealthCur = function () { return this.attributes.health; };

    // load assets
    fn.prototype.loadAssets = function () {
        var player_hull_asset = this.config.assets.player.hulls[this.attributes.hull_class_id];
        this.game.load.image(player_hull_asset.key, player_hull_asset.file);

        var player_thrust_sound = this.config.assets.sounds.thrust;
        this.game.load.audio(player_thrust_sound.key, player_thrust_sound.file);

        var player_bullet_sound = this.config.assets.sounds.bullet;
        this.game.load.audio(player_bullet_sound.key, player_bullet_sound.file);
    };

    // ship
    fn.prototype.setupShip = function () {
        // add ship to the game
        this.game.add.existing(this.getShip());

        // audio
        this.audio = {};
        this.audio.thrustSound = this.game.add.audio(this.config.assets.sounds.thrust.key);
        this.audio.bulletSound = this.game.add.audio(this.config.assets.sounds.bullet.key);

        // thruster audio events
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

        // weapon audio events
        this.ship.getWeapon('main_gun').onFire.add((function () {
            this.audio.bulletSound.play();
        }).bind(this));
        this.ship.getWeapon('p_main_gun').onFire.add((function () {
            this.audio.bulletSound.play();
        }).bind(this));
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
            // fire main gun
            var main_gun = this.ship.getWeapon('main_gun');
            var p_main_gun = this.ship.getWeapon('p_main_gun');

            // Make sure the speed of the bullet accounts for the speed of the ship
            main_gun.bulletSpeed = this.getMainGunBulletSpeed();

            // Shoot it in the right direction
            var forward_rotation = this.ship.rotation - Math.PI / 2;
            var x = (Math.cos(forward_rotation) * 10) + this.ship.x;
            var y = (Math.sin(forward_rotation) * 10) + this.ship.y;

            //main_gun.fire(this.ship, x, y);

            p_main_gun.fire();
        }
    }

    return fn;
})();
