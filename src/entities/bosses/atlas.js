import Boss from '../boss';
import AtlasSegments from './atlas/segments';

export default class Atlas extends Boss {
    constructor (sector, x, y) {
       super(sector, x, y);

       this.body.setSize(192, 192);
    }

    key () { return 'atlas'; }

    segmentsClass () { return AtlasSegments; }

    update () {
        if (this.alive) {
            let player = this.sector.getPlayer();
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

                /* if (this.hasLOSWithPlayer()) {
                    if (this.getEnergy() > 0) {
                        // fire main gun
                        this.getWeapon('mainGun').fire();
                    }
                } */
            }

            /* if (this.getEnergyRegenRate() > 0 && this.getEnergy() < this.getMaxEnergy()) {
                this.setEnergy(this.getEnergy() + this.getEnergyRegenRate());
            } */
        }
    }
}