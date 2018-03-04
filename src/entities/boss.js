import BossSegments from './boss/segments';

// Todo: Create a Physics.Arcade.Container class and us that instead of Phaser.Physics.Arcade.Image...
export default class Boss extends Phaser.Physics.Arcade.Image {
    constructor (sector, x, y) {
        super(sector.scene, x, y); 

        // config data
        this.config = this.config || {};
        this.config.bosses = this.scene.cache.json.get('bossesConfig');
        this.config.asset = this.scene.cache.json.get('assetsConfig');

        // the image itself isn't visible, it's segments are
        this.setVisible(false);

        // overwrite segmentClass in the actual boss class to give the correct segments class to us
        let SegmentsClass = this.segmentsClass();
        this.segments = new SegmentsClass(this);

        // let's keep track of our sector
        this.sector = sector;

        // add this object to physics engine
        this.scene.physics.add.existing(this);

        // 500 below is calculated to avoid problems with 32 pixel tiles
	    // within 1/30 of a second (target frame rate is 30+)
	    this.body.maxVelocity.x = 500;
	    this.body.maxVelocity.y = 500;

        // events
        this.events = this.events || new Phaser.EventEmitter();

        // default taxonomy
        this.taxonomy = 'boss';

        // add ourselves to the scenes updateList if we have defined an update function (likely in a child of this class)
        if (this.update) {
            this.scene.sys.updateList.add(this); // add ourselves to the scenes update list
        }
    }

    key () { throw Error('Virtual class. Inherit from me and overwrite key() with the associated key in bossesConfig json data.'); }

    segmentsClass () { return BossSegments; }

    preUpdate (time, delta) {
        if (super.preUpdate) {
            super.preUpdate.call(this, time, delta);
        }

        if (this.update) {
            this.update(time, delta); 
        }
    }

    get alive () { return this.active; }

    set alive (isAlive) { this.active = !!isAlive; }

    kill () {
        this.setActive(false);

        this.events.emit('killed');
    }

    revive () {
        this.setActive(true);
    }

    reset (x, y) {
        this.setPosition(x, y);
        this.revive();
    }

    setBounce (bounce) {
        super.setBounce(bounce);

        this.setAttribute('bounce', bounce);
    }

    getTaxonomy () { return this.taxonomy; }

    addCollider (target) {
        this.segments.addCollider(target);
    }

    getConfig () { return this.config.bosses[this.key()]; }
    getSpeed () { return this.getConfig().speed; }
    getMaxEnergy () { return this.getConfig().energy; }
    getEnergyRegenRate () { return this.getConfig().energy_regen_rate; }
    getEnergyIsShield () { return this.getConfig().energy_is_shield; }
    getMaxHealth () { return this.getConfig().health; }
    getHealthRegenRate () { return this.getConfig().health_regen_rate; }
    getBounce () { return this.getConfig().bounce; }

    accelerateToPoint (x, y, speed) {
        speed = speed || this.getBotConfig().speed || 0;

        let angle = Math.atan2(y - this.y, x - this.x);
        this.setRotation(angle); 
        this.scene.physics.velocityFromRotation(this.rotation, speed, this.body.acceleration);
    }

    accelerateToObject (dest, speed) {
        if (typeof dest !== 'object') return;

        this.accelerateToPoint(dest.x, dest.y, speed);
    }

    hasLOSWithPlayer () {
        let forwardRay = new Phaser.Geom.Line(this.x, this.y,
            this.x + Math.cos(this.rotation) * 1000, this.y + Math.sin(this.rotation) * 1000);

        let player = this.sector.getPlayer();
        let playerRay = new Phaser.Geom.Line(this.x, this.y, player.x, player.y);

        return Phaser.Math.Fuzzy.Equal(Phaser.Geom.Line.NormalAngle(forwardRay), Phaser.Geom.Line.NormalAngle(playerRay), 0.05);
    }

    // default is enemy test, child bosses can overwrite this
    isEnemy (ship) {
        if (ship.getTaxonomy().match(/player/)) {
            return true;
        }

        return false;
    }
}