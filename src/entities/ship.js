export default class Ship extends Phaser.Physics.Matter.Sprite {
    constructor (scene, x, y, key, frame) {
        // call sprite constructor
        super(scene.matter.world, x, y, key, frame);

        this.scene = scene;

        // config data
        this.config = this.config || {};
        this.config.assets = this.scene.cache.json.get('assetsConfig');

        // add this object to scene's matter physics
        this.scene.matterAddExisting(this);

        // ship attributes
        this.attributes = this.attributes || {};

        // addition event signals this.events is a Phaser.Events object
        this.events = this.events || new Phaser.EventEmitter();

        // track ship weapons
        this.weapons = this.weapons || {};

        // default taxonomy
        this.taxonomy = 'ship';
    }

    getWeapon (key) {
        if (!this.weapons[key]) return;

        return this.weapons[key];
    }

    addWeapon (key, weapon) { this.weapons[key] = weapon; }

    getAttributes () { return this.attributes; }

    getAttribute (key) { return this.attributes[key]; }

    setAttribute (key, value) {
        var oldValue = this.attributes[key];

        this.attributes[key] = value;

        this.events.emit('ChangeAttribute');
    }

    addAttribute (key, value) { this.setAttribute(key, value); }

    getTaxonomy () { return this.taxonomy; }
};
