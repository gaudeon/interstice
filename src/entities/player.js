// namespace
var App = App || {};

App.Player = (function () {
    "use strict";

    var fn = function (player_hulls) {
        // config data
        this.config = {};
        this.config.player_hulls = player_hulls;

        // player attributes
        this.attributes = {};

        // default to balanced hull class. TODO: Change me to support player chosen hull classes
        this.attributes.hull_class_id = "balanced";
        this.attributes.health = this.getHullHealth();

        // player ship. TODO: eventually this will likely be an entity
        this.ship = {};
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
    fn.prototype.getShip       = function () { return this.ship; };
    fn.prototype.setShipSprite = function (sprite) { this.ship.sprite = sprite; };
    fn.prototype.getShipSprite = function () { return this.ship.sprite; };

    return fn;
})();
