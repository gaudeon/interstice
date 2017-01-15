var App = App || {};

App.PlayerShip = (function () {
    "use strict";

    var fn = function (game, player) {
        // cache game and player objects
        this.game   = game;
        this.player = player;

        // config data
        this.config = {};
        this.config.assets   = this.game.cache.getJSON('assetsConfig');

        // call sprite constructor
        var ship_hull_asset = this.config.assets.player.hulls[this.player.getHullId()];
        Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, ship_hull_asset.key);


        // set how the graphic is displayed for the sprite
        this.anchor.setTo(player.getHullSpriteConfig().anchor);
        this.scale.setTo(player.getHullSpriteConfig().scale);

        game.physics.p2.enable(this, false);
        this.body.setRectangle(40, 40);
        this.fixedRotation = true;

        // setup status flags
        this.isFiring = false;

        // setup collision_group globallly if not there
        game.physics.p2.updateBoundsCollisionGroup();
        if ('undefined' === typeof this.game.global.collision_groups.player) {
            this.game.global.collision_groups.player = this.game.physics.p2.createCollisionGroup();
        }

        // setup collision_group for this object if not there
        if ('undefined' === typeof this.collision_group) {
            this.collision_group = this.game.global.collision_groups.player;
            this.body.setCollisionGroup(this.collision_group);
        }

        // addition event signals this.events is a Phaser.Events object
        this.events.onCollide = new Phaser.Signal();
    };

    fn.prototype = Object.create(Phaser.Sprite.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.getIsFiring = function () { return this.isFiring; };
    fn.prototype.setIsFiring = function (bool) { this.isFiring = bool; return this.isFiring; };

    fn.prototype.getCollisionGroup = function() { return this.collision_group; };

    return fn;
})();
