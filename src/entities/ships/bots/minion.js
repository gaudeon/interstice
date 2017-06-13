import Bot from '../bot';
import WeaponMinionMainGun from '../../../objects/weapons/weapon_minion_main_gun';

export default class MinionBot extends Bot {
    constructor (game, x, y, player, collisionManager) {
        super(game, x, y, player, collisionManager, 'minion');

        this.followingPlayer = false;
        this.followX = this.game.world.randomX;
        this.followY = this.game.world.randomY;

        // main gun
        var mainGun = new WeaponMinionMainGun(this.game, collisionManager);
        mainGun.createProjectiles(this.getMainGunBulletPoolCount());
        mainGun.trackSprite(this);
        this.addWeapon('mainGun', mainGun);

        // weapon audio events
        mainGun.events.onFire.add(() => {
            this.setEnergy(this.getEnergy() - this.getMainGunBulletEnergyCost());
        });

        this.taxonomy = 'bot.enemy.minion';
    }

    setupCollisions () {
        this.collisionManager.addToEnemiesCG(this);
        this.collisionManager.setCollidesWithPlayersCG(this);
        this.collisionManager.setCollidesWithPlayerProjectilesCG(this);
        this.collisionManager.setCollidesWithEnemiesCG(this);
        this.collisionManager.setCollidesWithSectorCG(this);
    }

    isEnemy (ship) {
        if (ship.getTaxonomy().match(/player/)) {
            return true;
        }

        return false;
    }

    tick () {
        if (this.alive) {
            if (this.player.alive) {
                if (Math.abs(this.player.body.x - this.body.x) < 200 && Math.abs(this.player.body.y - this.body.y) < 200) {
                    this.followingPlayer = true;
                } else if (Math.abs(this.player.body.x - this.body.x) > 450 && Math.abs(this.player.body.y - this.body.y) > 450) {
                    this.followingPlayer = false;
                    this.followX = this.game.world.randomX;
                    this.followY = this.game.world.randomX;
                }

                if (this.followingPlayer) {
                    this.accelerateToObject(this.player, this.getSpeed()); // start accelerateToObject on every bullet
                } else {
                    if (Math.abs(this.followX - this.x) < 75 && Math.abs(this.followY - this.y) < 75) {
                        this.followX = (((Math.random() * (0.8 - 0.2) + 0.2) * this.game.world.width) + this.x) % this.game.world.width;
                        this.followY = (((Math.random() * (0.8 - 0.2) + 0.2) * this.game.world.height) + this.y) % this.game.world.height;
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
