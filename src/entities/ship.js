export default class Ship extends Phaser.Physics.Arcade.Sprite {
    constructor (sector, x, y, key, frame) {
        // call sprite constructor
        super(sector.scene, x, y, key, frame);

        this.sector = sector;

        // config data
        this.config = this.config || {};
        this.config.assets = this.scene.cache.json.get('assetsConfig');

        // add this object to physics engine and scene
        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

        // restrict ships to world bounds
        this.setCollideWorldBounds(true);

        // ship attributes
        this.attributes = this.attributes || {};

        // addition event signals this.events is a Phaser.Events object
        this.events = this.events || new Phaser.EventEmitter();

        // track ship weapons
        this.weapons = this.weapons || {};

        // default taxonomy
        this.taxonomy = 'ship';
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

    getWeapon (key) {
        if (!this.weapons[key]) return;

        return this.weapons[key];
    }

    addWeapon (key, weapon) { this.scene.add.existing(weapon); this.weapons[key] = weapon; }

    getAttributes () { return this.attributes; }

    getAttribute (key) { return this.attributes[key]; }

    setAttribute (key, value) {
        var oldValue = this.attributes[key];

        this.attributes[key] = value;

        this.events.emit('ChangeAttribute');
    }

    addAttribute (key, value) { this.setAttribute(key, value); }

    getTaxonomy () { return this.taxonomy; }

    // since normally the only way to get game objects to 'update' is by adding them into a pool this is necessary ship we want ships to update when in the updateList
    preUpdate (time, delta) {
        super.preUpdate(time, delta);

        this.update(time, delta);
    }

    update (time, delta) { /* overrite me */ }
};
