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

        // add a collider with any tilemap layers that allow collisions. Note: property is set on the layer in Tiled
        // meaning we should make sure to let sectors create the ships, since the tilemap loading comes first
        this.colliders = [];
        for (let layer in this.sector.getLayers()) {
            let dynLayer = this.sector.getLayers()[layer];
            if (dynLayer.layer.properties.allowCollisions) {
                this.addCollider(dynLayer);
            }
        }

        // ship attributes
        this.attributes = {};
        this.attributes.bounce = 0;

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

    addWeapon (key, weapon) {
        this.scene.add.existing(weapon);
        this.weapons[key] = weapon;

        // add sector layers with collision to all weapons by default
        for (let layer in this.sector.getLayers()) {
            let dynLayer = this.sector.getLayers()[layer];
            if (dynLayer.layer.properties.allowCollisions) {
                this.weapons[key].addCollider(dynLayer);
            }
        }
    }

    getAttributes () { return this.attributes; }

    getAttribute (key) { return this.attributes[key]; }

    setAttribute (key, value) {
        var oldValue = this.attributes[key];

        this.attributes[key] = value;

        this.events.emit('ChangeAttribute');
    }

    addAttribute (key, value) { this.setAttribute(key, value); }

    setBounce (bounce) {
        super.setBounce(bounce);

        this.setAttribute('bounce', bounce);
    }

    getTaxonomy () { return this.taxonomy; }

    // since normally the only way to get game objects to 'update' is by adding them into a pool this is necessary ship we want ships to update when in the updateList
    preUpdate (time, delta) {
        super.preUpdate(time, delta);

        this.update(time, delta);
    }

    takeDamage (amount) { /* overrite me */ }

    update (time, delta) { /* overrite me */ }

    addCollider (target) {
        this.colliders.push(this.scene.physics.add.collider(this, target));
    }

    addWeaponCollider (target) {
        for (let weapon in this.weapons) {
            this.weapons[weapon].addCollider(target);
        }
    }
};
