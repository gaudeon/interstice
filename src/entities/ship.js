var App = App || {};

App.Ship = (function () {
    "use strict";

    var fn = function (game, x, y, key, frame) {
        // call sprite constructor
        Phaser.Sprite.call(this, game, x, y, key, frame);

        // config data
        this.config        = this.config        || {};
        this.config.assets = this.config.assets || this.game.cache.getJSON('assetsConfig');

        this._game = game;

        // enable p2 physics
        this.game.physics.p2.enable(this, false);

        // ship attributes
        this.attributes = this.attributes || {};

        // add alias to the collision_manager
        this.gcm = this.gcm || this.game.global.collision_manager;

        // addition event signals this.events is a Phaser.Events object
        this.events                   = this.events || {};
        this.events.onChangeAttribute = new Phaser.Signal();

        // track ship weapons
        this.weapons = this.weapons || {};
    };

    fn.prototype = Object.create(Phaser.Sprite.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.getCollisionManager = function () { return this.gcm; };

    fn.prototype.getWeapon = function (key) {
        if (!this.weapons[key]) return;

        return this.weapons[key];
    };

    fn.prototype.addWeapon = function (key, weapon) { this.weapons[key] = weapon; };

    fn.prototype.getAttributes = function () { return this.attributes; };

    fn.prototype.getAttribute = function (key) { return this.attributes[key]; };

    fn.prototype.addAttribute = fn.prototype.setAttribute = function (key, value) {
        var old_value = this.attributes[key];

        this.attributes[key] = value;

        this.events.onChangeAttribute.dispatch(key, value, old_value);
    };

    return fn;
})();
