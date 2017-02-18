// namespace
var App = App || {};

App.Player = (function () {
    "use strict";

    var fn = function (game) {
        App.Ship.call(this, game);

        // config data
        this.config          = this.config          || {};
        this.config.assets   = this.config.assets   || game.cache.getJSON('assetsConfig');
        this.config.controls = this.config.controls || game.cache.getJSON('controlsConfig');
        this.config.player   = this.config.player   || game.cache.getJSON('playerConfig');
    };

    fn.prototype = Object.create(App.Ship.prototype);
    fn.prototype.constructor = fn;

    // player class id
    fn.prototype.getShipClassId = function () { return this.ship_class_id; };

    // hull
    fn.prototype.getHullConfig          = function () { return this.config.player.hulls[this.getShipClassId()]; }
    fn.prototype.getHullName            = function () { return this.getHullConfig().name; };
    fn.prototype.getHullEnergy          = function () { return this.getHullConfig().energy; };
    fn.prototype.getHullEnergyRegenRate = function () { return this.getHullConfig().energy_regen_rate; };
    fn.prototype.getHullHealth          = function () { return this.getHullConfig().health; };
    fn.prototype.getHullHealthRegenRate = function () { return this.getHullConfig().health_regen_rate; };
    fn.prototype.getHullThrust          = function () { return this.getHullConfig().thrust; };
    fn.prototype.getHullRotation        = function () { return this.getHullConfig().rotation; };
    fn.prototype.getHullSpriteConfig    = function () { return this.getHullConfig().sprite; };

    // main gun info
    fn.prototype.getMainGunBulletType        = function () { return this.config.player.main_gun.bullet_type; };
    fn.prototype.getMainGunBulletPoolCount   = function () { return this.config.player.main_gun.bullet_pool_count; };
    fn.prototype.getMainGunBulletAngleOffset = function () { return this.config.player.main_gun.bullet_angle_offset; };
    fn.prototype.getMainGunBulletFireRate    = function () { return this.config.player.main_gun.bullet_fire_rate; };
    fn.prototype.getMainGunBulletSpeed       = function () { return this.config.player.main_gun.bullet_speed; };
    fn.prototype.getMainGunBulletEnergyCost  = function () { return this.config.player.main_gun.bullet_energy_cost; };

    // health
    fn.prototype.setHealth = function (health) {
        this.attributes.health = health;

        // don't exceed maximum
        if (this.attributes.health > this.getHullHealth()) this.attributes.health = this.getHullHealth();
    };
    fn.prototype.getHealth = function () { return this.attributes.health; };

    // energy
    fn.prototype.setEnergy = function (energy) {
        this.attributes.energy = energy;

        // don't exceed maximum
        if (this.attributes.energy > this.getHullEnergy()) this.attributes.health = this.getHullEnergy();
    };
    fn.prototype.getEnergy = function () { return this.attributes.energy; };

    // load assets
    fn.prototype.loadAssets = function () {
        _.each(['balanced'], (function (class_id) {
            var player_hull_asset = this.config.assets.player.hulls[class_id];
            if (!player_hull_asset.in_atlas) {
                this.game.load.image(player_hull_asset.key, player_hull_asset.file);
            }
        }).bind(this));

        // sounds
        var thrust = this.config.assets.sounds.thrust;
        this.game.load.audio(thrust.key, thrust.file);

        var bullet = this.config.assets.sounds.bullet;
        this.game.load.audio(bullet.key, bullet.file);

        var ship_explosion = this.config.assets.sounds.ship_explosion;
        this.game.load.audio(ship_explosion.key, ship_explosion.file);
    };

    // setup ship
    fn.prototype.setupShip = function (x, y) {
        // default to balanced hull class. TODO: Change me to support player chosen hull classes
        this.ship_class_id = 'balanced';

        if ('undefined' === typeof x) x = this.game.world.width / 2;
        if ('undefined' === typeof y) y = this.game.world.height / 2;

        this.loadTexture(this.config.assets.player.hulls[this.ship_class_id].key);
        if (this.config.assets.player.hulls[this.ship_class_id].in_atlas) {
            this.frameName = this.config.assets.player.hulls[this.ship_class_id].frame;
        }
        this.reset(x, y);

        // set how the graphic is displayed for the sprite
        this.anchor.setTo(this.getHullSpriteConfig().anchor);
        this.scale.setTo(this.getHullSpriteConfig().scale);

        // physics related
        this.body.setRectangle(40, 40);
        this.body.rotation = this.game.math.PI2 / 4;

        // add ship to the game
        this.game.add.existing(this);

        // entities are on top
        this.game.world.bringToTop(this);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        this.game.camera.follow(this, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        // setup player attributes
        this.addAttribute('health', this.getHullHealth());
        this.addAttribute('energy', this.getHullEnergy());

        // setup collisions
        this.getCollisionManager().addToPlayersCG(this);
        this.getCollisionManager().setCollidesWithEnemiesCG(this);
        this.getCollisionManager().setCollidesWithEnemyProjectilesCG(this);
        this.getCollisionManager().setCollidesWithSectorCG(this);

        // ship impact
        this.body.onBeginContact.add(this.impactHandler, this);

        // main gun
        var main_gun = new App.WeaponPlayerMainGun(this.game);
        main_gun.createProjectiles(this.getMainGunBulletPoolCount());
        main_gun.trackSprite(this);
        this.addWeapon('main_gun', main_gun);

        // audio
        this.audio = {};
        this.audio.thrustSound        = this.game.add.audio(this.config.assets.sounds.thrust.key, 1, true);
        this.audio.bulletSound        = this.game.add.audio(this.config.assets.sounds.bullet.key);
        this.audio.shipExplosionSound = this.game.add.audio(this.config.assets.sounds.ship_explosion.key);

        // keyboard events
        this.keyboard = this.game.input.keyboard.createCursorKeys();
        _.each(['thrustForward','thrustReverse','rotateLeft','rotateRight','fireBullets'], (function (control) {
            var keycode = Phaser.KeyCode[this.config.controls[control]];
            this.keyboard[control] = this.game.input.keyboard.addKey(keycode);
        }).bind(this));

        // thruster audio events
        this.keyboard.thrustForward.onDown.add((function() {
            if (this.alive)
                this.audio.thrustSound.play();
        }).bind(this));
        this.keyboard.thrustForward.onUp.add((function() {
            this.audio.thrustSound.stop();
        }).bind(this));
        this.keyboard.thrustReverse.onDown.add((function() {
            if (this.alive)
                this.audio.thrustSound.play();
        }).bind(this));
        this.keyboard.thrustReverse.onUp.add((function() {
            this.audio.thrustSound.stop();
        }).bind(this));

        // weapon audio events
        this.getWeapon('main_gun').events.onFire.add((function () {
            this.audio.bulletSound.play();

            this.setEnergy( this.getEnergy() - this.getMainGunBulletEnergyCost() );
        }).bind(this));

        // death audio events
        this.events.onKilled.add((function () {
            this.audio.thrustSound.stop();
            this.audio.shipExplosionSound.play();
        }).bind(this));
    };

    // taking damage
    fn.prototype.damage = function (amount) {
        var curEnergy = this.getEnergy();
        var curHealth = this.getHealth();

        var remaining_amount = curEnergy < amount ? amount - curEnergy : 0;

        // damage energy shield first then player health
        this.setEnergy(curEnergy - amount + remaining_amount);
        this.setHealth(curHealth - remaining_amount);

        if (this.getHealth() <= 0) {
            this.kill();
        }
    };

    fn.prototype.tick = function () {
        if (this.alive) {
            if (this.keyboard.thrustForward.isDown) {
                this.body.thrust(this.getHullThrust());
            }
            else if (this.keyboard.thrustReverse.isDown) {
                this.body.reverse(this.getHullThrust());
            }

            if (this.keyboard.rotateLeft.isDown) {
                this.body.rotateLeft(this.getHullRotation());
            }
            else if (this.keyboard.rotateRight.isDown) {
                this.body.rotateRight(this.getHullRotation());
            }
            else {
                this.body.setZeroRotation();
            }

            if (this.keyboard.fireBullets.isDown) {
                if (this.getEnergy() > 0) {
                    // fire main gun
                    this.getWeapon('main_gun').fire();
                }
            }

            if (this.getHullEnergyRegenRate() > 0 && this.getEnergy() < this.getHullEnergy()) {
                this.setEnergy( this.getEnergy() + this.getHullEnergyRegenRate() );
            }
        }
    }

    fn.prototype.impactHandler = function (body, shape1, shape2, equation) {
        var x = 0;
        var y = 0;

        if (body && body !== 'null' && body !== 'undefined') {
            x = body.velocity.x;
            y = body.velocity.y;
        }

        var v1 = new Phaser.Point(this.body.velocity.x, this.body.velocity.y);
        var v2 = new Phaser.Point(x, y);

        var xdiff = Math.abs(v1.x - v2.x);
        var ydiff = Math.abs(v1.y - v2.y);

        var damage = 0;
        if (xdiff > 500 || ydiff > 500) { //Massive damage!
            damage = 20;
        } else if (xdiff > 200 || ydiff > 200) { //Slight damage
            damage = 10;
        }

        var curEnergy = this.getEnergy();
        var curHealth = this.getHealth();

        var remaining_damage = curEnergy < damage ? damage - curEnergy : 0;

        // damage energy shield first then player health
        this.setEnergy(curEnergy - damage + remaining_damage);
        this.setHealth(curHealth - remaining_damage);
    }

    return fn;
})();
