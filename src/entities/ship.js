export default class Ship extends Phaser.Sprite {
    constructor (game, x, y, key, frame, collisionManager) {
        // call sprite constructor
        super(game, x, y, key, frame);

        // config data
        this.config = this.config || {};
        this.config.assets = this.game.cache.getJSON('assetsConfig');

        // enable p2 physics
        this.game.physics.p2.enable(this, false);

        // ship attributes
        this.attributes = this.attributes || {};

        // add alias to the collisionManager
        this.collisionManager = collisionManager;

        // addition event signals this.events is a Phaser.Events object
        this.events = this.events || {};
        this.events.onChangeAttribute = new Phaser.Signal();

        // track ship weapons
        this.weapons = this.weapons || {};

        // default taxonomy
        this.taxonomy = 'ship';
    }

    getCollisionManager () { return this.collisionManager; }

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

        this.events.onChangeAttribute.dispatch(key, value, oldValue);
    }

    addAttribute (key, value) { this.setAttribute(key, value); }

    getTaxonomy () { return this.taxonomy; }
};
