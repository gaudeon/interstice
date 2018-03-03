import Ship from '../ship';
import WeaponPlayerMainGun from '../../combat/weapons/weapon_player_main_gun';

export default class Player extends Ship {
    constructor (sector, x, y) {
        // default to balanced chasis class. TODO: Change me to support player chosen chasis classes
        const PLAYER_CLASS_ID = 'balanced';
        const PLAYER_CHASIS_CLASS = 'player_chasis_' + PLAYER_CLASS_ID;
        let assetConfig = sector.scene.cache.json.get('assetsConfig');

        super(sector, x, y, assetConfig[PLAYER_CHASIS_CLASS].key, assetConfig[PLAYER_CHASIS_CLASS].in_atlas ? assetConfig[PLAYER_CHASIS_CLASS].frame : null);

        this.ship_class_id = PLAYER_CLASS_ID;

        // config data
        this.config = this.config || {};
        this.config.assets = this.config.assets || this.scene.cache.json.get('assetsConfig');
        this.config.controls = this.config.controls || this.scene.cache.json.get('controlsConfig');
        this.config.player = this.config.player || this.scene.cache.json.get('playerConfig');

        // the ship classification for grouping purposes
        this.taxonomy = 'human.player';

        // set how the graphic is displayed for the sprite
        this.setOrigin(this.getChasisSpriteConfig().anchor);
        this.setScale(this.getChasisSpriteConfig().scale);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        this.scene.cameras.main.startFollow(this);

        // setup player attributes
        this.addAttribute('health', this.getChasisHealth());
        this.addAttribute('energy', this.getChasisEnergy());
        this.setBounce(this.getChasisBounce());

        // main gun
        var mainGun = new WeaponPlayerMainGun(this.scene);
        mainGun.createProjectiles(this.getMainGunBulletPoolCount());
        mainGun.trackSprite(this);
        this.addWeapon('mainGun', mainGun);

        // audio
        this.audio = {};
        this.audio.thrustSound = this.scene.sound.add(this.config.assets[this.thrustSoundAssetKey()].key, 1, true);
        this.audio.bulletSound = this.scene.sound.add(this.config.assets[this.bulletSoundAssetKey()].key);
        this.audio.shipExplosionSound = this.scene.sound.add(this.config.assets[this.shipExplosionSoundAssetKey()].key);

        // keyboard events
        this.keyboard = this.scene.input.keyboard.createCursorKeys();
        console.log(this.config.controls);
        _.each(Object.keys(this.config.controls), (control) => {
            this.keyboard[control] = [];
            _.each(this.config.controls[control], (each_key)  => {
                var keycode = Phaser.Input.Keyboard.KeyCodes[each_key];
                this.keyboard[control].push(this.scene.input.keyboard.addKey(keycode));
            })
        });

        // weapon events
        this.getWeapon('mainGun').on('fire', () => {
            this.audio.bulletSound.play();

            this.setEnergy(this.getEnergy() - this.getMainGunBulletEnergyCost());
        });

        // death audio events
        this.events.on('killed', () => {
            this.audio.thrustSound.stop();
            this.audio.shipExplosionSound.play();
        });

        this.scene.events.on('shutdown', () => {
            this.audio.thrustSound.stop();
        });
    }

    // player class id
    getShipClassId () { return 'chasis_' + this.ship_class_id; }

    // chasis 
    getChasisConfig () { return this.config.player[this.getShipClassId()]; }
    getChasisName () { return this.getChasisConfig().name; }
    getChasisEnergy () { return this.getChasisConfig().energy; }
    getChasisEnergyRegenRate () { return this.getChasisConfig().energy_regen_rate; }
    getChasisHealth () { return this.getChasisConfig().health; }
    getChasisHealthRegenRate () { return this.getChasisConfig().health_regen_rate; }
    getChasisThrustSpeed () { return this.getChasisConfig().thrustSpeed; }
    getChasisRotationSpeed () { return this.getChasisConfig().rotationSpeed; }
    getChasisSpriteConfig () { return this.getChasisConfig().sprite; }
    getChasisBounce () { return this.getChasisConfig().bounce; }

    // main gun info
    getMainGunBulletType () { return this.config.player.main_gun.bullet_type; }
    getMainGunBulletPoolCount () { return this.config.player.main_gun.bullet_pool_count; }
    getMainGunBulletAngleOffset () { return this.config.player.main_gun.bullet_angle_offset; }
    getMainGunBulletFireRate () { return this.config.player.main_gun.bullet_fire_rate; }
    getMainGunBulletSpeed () { return this.config.player.main_gun.bullet_speed; }
    getMainGunBulletEnergyCost () { return this.config.player.main_gun.bullet_energy_cost; }

    // health
    setHealth (health) {
        this.attributes.health = health;

        // don't exceed maximum
        if (this.attributes.health > this.getChasisHealth()) this.attributes.health = this.getChasisHealth();
    }
    getHealth () { return this.attributes.health; }

    // energy
    setEnergy (energy) {
        this.attributes.energy = energy;

        // don't exceed maximum
        if (this.attributes.energy > this.getChasisEnergy()) this.attributes.health = this.getChasisEnergy();
    }
    getEnergy () { return this.attributes.energy; }

    // sound asset keys
    thrustSoundAssetKey () { return 'sound_thrust'; }
    bulletSoundAssetKey () { return 'sound_bullet'; }
    shipExplosionSoundAssetKey () { return 'sound_ship_explosion'; }

    // taking damage
    takeDamage (amount) {
        var curEnergy = this.getEnergy();
        var curHealth = this.getHealth();

        var remainingAmount = curEnergy < amount ? amount - curEnergy : 0;

        // damage energy shield first then player health
        this.setEnergy(curEnergy - amount + remainingAmount);
        this.setHealth(curHealth - remainingAmount);

        if (this.getHealth() <= 0) {
            this.kill();
        }
    }

    update (time, delta) {
        if (this.alive) {
            // acceleration
            let forward = this.keyboard.thrustForward.some(keycode => keycode.isDown);
            let reverse = this.keyboard.thrustReverse.some(keycode => keycode.isDown);
            let left    = this.keyboard.rotateLeft.some(keycode => keycode.isDown);
            let right   = this.keyboard.rotateRight.some(keycode => keycode.isDown);
            let fire    = this.keyboard.fire.some(keycode => keycode.isDown);
            if (forward) {
                this.scene.physics.velocityFromRotation(this.rotation, this.getChasisThrustSpeed(), this.body.acceleration);
            } else if (reverse) {
                this.scene.physics.velocityFromRotation(this.rotation, -this.getChasisThrustSpeed(), this.body.acceleration);
            } else {
                this.setAcceleration(0);
            }

            // rotation
            if (left) {
                this.setAngularVelocity(-this.getChasisRotationSpeed());
            } else if (right) {
                this.setAngularVelocity(this.getChasisRotationSpeed());
            } else {
                this.setAngularVelocity(0);
            }

            // weapons
            if (fire) {
                if (this.getEnergy() > 0) {
                    // fire main gun
                    this.getWeapon('mainGun').fire();
                }
            }

            // chasis energy regeneration
            if (this.getChasisEnergyRegenRate() > 0 && this.getEnergy() < this.getChasisEnergy()) {
                this.setEnergy(this.getEnergy() + this.getChasisEnergyRegenRate());
            }

            // sound
            if (forward || reverse) {
                if (!this.thrustSoundIsPlaying) {
                    this.thrustSoundIsPlaying = true;
                    this.audio.thrustSound.play({ loop: true });
                }
            } else {
                this.thrustSoundIsPlaying = false;
                this.audio.thrustSound.stop();
            }
        }
    }
};
