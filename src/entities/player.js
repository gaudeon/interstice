// namespace
var App = App || {};

App.Player = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;

        // config data
        this.config = {};
        this.config.player_hulls = this.game.cache.getJSON('playerHullsConfig');

        // player attributes
        this.attributes = {};

        // default to balanced hull class. TODO: Change me to support player chosen hull classes
        this.attributes.hull_class_id = "balanced";
        this.attributes.health = this.getHullHealth();
    };

    // hull
    fn.prototype.getHullConfig   = function () { return this.config.player_hulls[this.attributes.hull_class_id]; }
    fn.prototype.getHullId       = function () { return this.attributes.hull_class_id; };
    fn.prototype.getHullName     = function () { return this.getHullConfig().name; };
    fn.prototype.getHullEnergy   = function () { return this.getHullConfig().energy; };
    fn.prototype.getHullHealth   = function () { return this.getHullConfig().health; };
    fn.prototype.getHullThrust   = function () { return this.getHullConfig().thrust; };
    fn.prototype.getHullRotation = function () { return this.getHullConfig().rotation; };
    fn.prototype.getHullAsset    = function () { return this.getHullConfig().asset; };

    // current values
    fn.prototype.setHullHealthCur = function (health) { this.attributes.health = health; };
    fn.prototype.getHullHealthCur = function () { return this.attributes.health; };

    // ship
    fn.prototype.getShip       = function () {
        if ('undefined' !== typeof this.ship) return this.ship;

        this.ship = new App.PlayerShip(this.game, this);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        this.game.camera.follow(this.ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        return this.ship;
    };

    return fn;
})();
