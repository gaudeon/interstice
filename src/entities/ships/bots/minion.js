import Bot from '../bot';
import WeaponMinionMainGun from '../../../combat/weapons/weapon_minion_main_gun';

export default class MinionBot extends Bot {
    constructor (sector, x, y) {
        super(sector, x, y, 'minion');

        this.followingPlayer = false;
        this.followX = Phaser.Math.Between(0, this.scene.sys.game.config.width);
        this.followY = Phaser.Math.Between(0, this.scene.sys.game.config.height);

        // main gun
        var mainGun = new WeaponMinionMainGun(this.scene);
        mainGun.createProjectiles(this.getMainGunBulletPoolCount());
        mainGun.trackSprite(this);
        this.addWeapon('mainGun', mainGun);

        // weapon audio events

        mainGun.events.on('fire', () => {
            this.setEnergy(this.getEnergy() - this.getMainGunBulletEnergyCost());
        });

        // the ship classification for grouping purposes
        this.taxonomy = 'bot.enemy.minion';
    }

    isEnemy (ship) {
        if (ship.getTaxonomy().match(/player/)) {
            return true;
        }

        return false;
    }

    tick () {
        let player = this.sector.getPlayer();
        if (this.active) {
            if (player && player.alive) {
                if (Math.abs(player.body.x - this.body.x) < 200 && Math.abs(player.body.y - this.body.y) < 200) {
                    this.followingPlayer = true;
                } else if (Math.abs(player.body.x - this.body.x) > 450 && Math.abs(player.body.y - this.body.y) > 450) {
                    this.followingPlayer = false;
                    this.followX = Phaser.Math.Between(0, this.scene.sys.game.config.width);
                    this.followY = Phaser.Math.Between(0, this.scene.sys.game.config.height);
                }

                if (this.followingPlayer) {
                    this.accelerateToObject(player, this.getSpeed()); // start accelerateToObject on every bullet
                } else {
                    if (Math.abs(this.followX - this.x) < 75 && Math.abs(this.followY - this.y) < 75) {
                        this.followX = (((Math.random() * (0.8 - 0.2) + 0.2) * this.scene.sys.game.config.width) + this.x) % this.scene.sys.game.config.width;
                        this.followY = (((Math.random() * (0.8 - 0.2) + 0.2) * this.scene.sys.game.config.height) + this.y) % this.scene.sys.game.config.height;
                    }
                    this.accelerateToPoint(this.followX, this.followY, this.getSpeed() * 0.75); // start accelerateToObject on every bullet
                }

                if (this.hasLOSWithPlayer()) {
                    if (this.getEnergy() > 0) {
                        // fire main gun
                        this.getWeapon('mainGun').fire();
                    }
                }
            }

            if (this.getEnergyRegenRate() > 0 && this.getEnergy() < this.getMaxEnergy()) {
                this.setEnergy(this.getEnergy() + this.getEnergyRegenRate());
            }
        }
    }
};
