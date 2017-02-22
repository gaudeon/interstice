// namespace
var App = App || {};

App.Bot = (function () {
    "use strict";

    var fn = function (game, x, y, class_id) {
        // config data
        this.config       = this.config || {};
        this.config.bots  = this.config.bots || game.cache.getJSON('botsConfig');
        this.config.asset = this.config.assets || game.cache.getJSON('assetsConfig').bots[class_id];

        App.Ship.call(this, game, x, y, this.config.asset.key);

        if (this.config.asset.in_atlas) {
            this.frameName = this.config.asset.frame;
        }

        this.game = game;

        // sprite attributes
        this.anchor.setTo(this.config.bots[class_id].sprite.anchor);
        this.scale.setTo(this.config.bots[class_id].sprite.scale);

        // bot attributes
        this.attributes = this.attributes || {};

        // this needs to be set for each bot
        this.attributes.bot_class_id = class_id;

        // setup bot attributes
        this.addAttribute('health', this.getMaxHealth());
        this.addAttribute('energy', this.getMaxEnergy());

        // setup physics body for this sprite
        this.game.physics.p2.enable(this, false);
        this.body.setRectangle(40, 40);

        // setup collision_group globallly if not there
        this.setupCollisions();

        // audio
        this.audio = {};
        this.audio.shipExplosionSound = this.game.add.audio(this.config.assets.sounds.ship_explosion.key);

        // explode on death
        this.events.onKilled.add((function () {
            this.audio.shipExplosionSound.play();
        }).bind(this));

        this.taxonomy = 'bot';
    };

    fn.prototype = Object.create(App.Ship.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.getBotClassId  = function () {
        if ('undefined' === typeof this.attributes.bot_class_id) {
            throw "Bot Class Id is not defined";
        }

        return this.attributes.bot_class_id;
    };

    fn.prototype.getBotConfig            = function () { return this.config.bots[this.getBotClassId()]; };
    fn.prototype.getSpeed                = function () { return this.getBotConfig().speed; };
    fn.prototype.getCollisionGroup       = function () { return this.collision_group; };
    fn.prototype.getTargetingAngleOffset = function () { return this.getBotConfig().targeting_angle_offset; };
    fn.prototype.getMaxEnergy            = function () { return this.getBotConfig().energy; };
    fn.prototype.getEnergyRegenRate      = function () { return this.getBotConfig().energy_regen_rate; };
    fn.prototype.getEnergyIsShield       = function () { return this.getBotConfig().energy_is_shield; };
    fn.prototype.getMaxHealth            = function () { return this.getBotConfig().health; };
    fn.prototype.getHealthRegenRate      = function () { return this.getBotConfig().health_regen_rate; };

    // main gun info
    fn.prototype.getMainGunBulletType        = function () { return this.getBotConfig().main_gun.bullet_type; };
    fn.prototype.getMainGunBulletPoolCount   = function () { return this.getBotConfig().main_gun.bullet_pool_count; };
    fn.prototype.getMainGunBulletAngleOffset = function () { return this.getBotConfig().main_gun.bullet_angle_offset; };
    fn.prototype.getMainGunBulletFireRate    = function () { return this.getBotConfig().main_gun.bullet_fire_rate; };
    fn.prototype.getMainGunBulletSpeed       = function () { return this.getBotConfig().main_gun.bullet_speed; };
    fn.prototype.getMainGunBulletEnergyCost  = function () { return this.getBotConfig().main_gun.bullet_energy_cost; };

    // health
    fn.prototype.setHealth = function (health) {
        this.attributes.health = health;

        // don't exceed maximum
        if (this.attributes.health > this.getMaxHealth()) this.attributes.health = this.getMaxHealth();
    };
    fn.prototype.getHealth = function () { return this.attributes.health; };

    // energy
    fn.prototype.setEnergy = function (energy) {
        this.attributes.energy = energy;

        // don't exceed maximum
        if (this.attributes.energy > this.getMaxEnergy()) this.attributes.health = this.getMaxEnergy();
    };
    fn.prototype.getEnergy = function () { return this.attributes.energy; };

    // taking damage
    fn.prototype.damage = function (amount) {
        if (this.getEnergyIsShield()) {
            var curEnergy = this.getEnergy();
            var curHealth = this.getHealth();

            var remaining_amount = curEnergy < amount ? amount - curEnergy : 0;

            // damage energy shield first then player health
            this.setEnergy(curEnergy - amount + remaining_amount);
            this.setHealth(curHealth - remaining_amount);
        }
        else {
            var curHealth = this.getHealth();
            this.setHealth(curHealth - amount);
        }

        if (this.getHealth() <= 0) {
            this.kill();
        }
    };

    fn.prototype.tick = function () { /* overwrite me to do stuff */ };

    fn.prototype.accelerateToPoint = function (x, y, speed) {
        var speed = speed || this.getBotConfig().speed || 0;

        var angle = Math.atan2(y - this.y, x - this.x);
        this.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
        this.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
        this.body.force.y = Math.sin(angle) * speed;
    };

    fn.prototype.accelerateToObject = function (dest, speed) {
        if ('object' !== typeof dest) return;

        this.accelerateToPoint(dest.x, dest.y, speed);
    };

    fn.prototype.hasLOSWithPlayer = function () {
        var forward_rotation = this.rotation - this.game.math.degToRad(this.getTargetingAngleOffset() || 0);
        var forward_ray = new Phaser.Line(this.x, this.y,
            this.x + Math.cos(forward_rotation) * 1000, this.y + Math.sin(forward_rotation) * 1000);

        var player_ray = new Phaser.Line();
        player_ray.fromSprite(this,this.player);

        return Phaser.Math.fuzzyEqual(forward_ray.normalAngle, player_ray.normalAngle, 0.05);
    };

    // default collisions setup, child bots should overwrite this
    fn.prototype.setupCollisions = function () { };

    // default is enemy test, child bots should overwrite this
    fn.prototype.isEnemy = function (ship) {
        return false;
    };

    return fn;
})();
