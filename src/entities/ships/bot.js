import Ship from '../ship';

export default class Bot extends Ship {
    constructor (game, x, y, player, collisionManager, classId) {
        const BOT_ASSET_KEY = 'bot_' + classId;
        let assetConfig = game.cache.getJSON('assetsConfig')[BOT_ASSET_KEY];

        super(game, x, y, assetConfig.key, null, collisionManager);

        // config data
        this.config = this.config || {};
        this.config.bots = game.cache.getJSON('botsConfig');
        this.config.asset = assetConfig;

        if (this.config.asset.in_atlas) {
            this.frameName = this.config.asset.frame;
        }

        // sprite attributes
        this.anchor.setTo(this.config.bots[classId].sprite.anchor);
        this.scale.setTo(this.config.bots[classId].sprite.scale);

        // bot attributes
        this.attributes = this.attributes || {};

        // these need to be set for each bot
        this.attributes.bot_class_id = classId;
        this.player = player;

        // setup bot attributes
        this.addAttribute('health', this.getMaxHealth());
        this.addAttribute('energy', this.getMaxEnergy());

        // setup physics body for this sprite
        this.game.physics.p2.enable(this, false);
        this.body.setRectangle(40, 40);

        // setup collision_group globallly if not there
        this.setupCollisions();

        // audio
        const SHIP_EXPLOSION_SOUND_ASSET_KEY = 'sound_ship_explosion';
        this.audio = {};
        this.audio.shipExplosionSound = this.game.add.audio(this.config.assets[SHIP_EXPLOSION_SOUND_ASSET_KEY].key);

        // explode on death
        this.events.onKilled.add(() => {
            this.audio.shipExplosionSound.play();
        });

        this.taxonomy = 'bot';
    }

    getBotClassId () {
        if (typeof this.attributes.bot_class_id === 'undefined') {
            throw new Error('Bot Class Id is not defined');
        }

        return this.attributes.bot_class_id;
    }

    getBotConfig () { return this.config.bots[this.getBotClassId()]; }
    getSpeed () { return this.getBotConfig().speed; }
    getCollisionGroup () { return this.collision_group; }
    getTargetingAngleOffset () { return this.getBotConfig().targeting_angle_offset; }
    getMaxEnergy () { return this.getBotConfig().energy; }
    getEnergyRegenRate () { return this.getBotConfig().energy_regen_rate; }
    getEnergyIsShield () { return this.getBotConfig().energy_is_shield; }
    getMaxHealth () { return this.getBotConfig().health; }
    getHealthRegenRate () { return this.getBotConfig().health_regen_rate; }

    // main gun info
    getMainGunBulletType () { return this.getBotConfig().main_gun.bullet_type; }
    getMainGunBulletPoolCount () { return this.getBotConfig().main_gun.bullet_pool_count; }
    getMainGunBulletAngleOffset () { return this.getBotConfig().main_gun.bullet_angle_offset; }
    getMainGunBulletFireRate () { return this.getBotConfig().main_gun.bullet_fire_rate; }
    getMainGunBulletSpeed () { return this.getBotConfig().main_gun.bullet_speed; }
    getMainGunBulletEnergyCost () { return this.getBotConfig().main_gun.bullet_energy_cost; }

    // health
    setHealth (health) {
        this.attributes.health = health;

        // don't exceed maximum
        if (this.attributes.health > this.getMaxHealth()) this.attributes.health = this.getMaxHealth();
    }
    getHealth () { return this.attributes.health; };

    // energy
    setEnergy (energy) {
        this.attributes.energy = energy;

        // don't exceed maximum
        if (this.attributes.energy > this.getMaxEnergy()) this.attributes.health = this.getMaxEnergy();
    }
    getEnergy () { return this.attributes.energy; }

    // taking damage
    damage (amount) {
        let curHealth, curEnergy;
        if (this.getEnergyIsShield()) {
            curEnergy = this.getEnergy();
            curHealth = this.getHealth();

            let remainingAmount = curEnergy < amount ? amount - curEnergy : 0;

            // damage energy shield first then player health
            this.setEnergy(curEnergy - amount + remainingAmount);
            this.setHealth(curHealth - remainingAmount);
        } else {
            curHealth = this.getHealth();
            this.setHealth(curHealth - amount);
        }

        if (this.getHealth() <= 0) {
            this.kill();
        }
    }

    tick () { /* overwrite me to do stuff */ }

    accelerateToPoint (x, y, speed) {
        speed = speed || this.getBotConfig().speed || 0;

        let angle = Math.atan2(y - this.y, x - this.x);
        this.body.rotation = angle + this.game.math.degToRad(90); // correct angle of angry bullets (depends on the sprite used)
        this.body.force.x = Math.cos(angle) * speed; // accelerateToObject
        this.body.force.y = Math.sin(angle) * speed;
    }

    accelerateToObject (dest, speed) {
        if (typeof dest !== 'object') return;

        this.accelerateToPoint(dest.x, dest.y, speed);
    }

    hasLOSWithPlayer () {
        let forwardRotation = this.rotation - this.game.math.degToRad(this.getTargetingAngleOffset() || 0);
        let forwardRay = new Phaser.Line(this.x, this.y,
            this.x + Math.cos(forwardRotation) * 1000, this.y + Math.sin(forwardRotation) * 1000);

        let playerRay = new Phaser.Line();
        playerRay.fromSprite(this, this.player);

        return Phaser.Math.fuzzyEqual(forwardRay.normalAngle, playerRay.normalAngle, 0.05);
    }

    // default collisions setup, child bots should overwrite this
    setupCollisions () { }

    // default is enemy test, child bots should overwrite this
    isEnemy (ship) {
        return false;
    }
};
