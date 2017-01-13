var App = App || {};

App.PlayerShip = (function () {
    "use strict";

    var fn = function (game, player) {
        Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, 'player_ship_image');

        // cache game and player objects
        this.game   = game;
        this.player = player;

        // set how the graphic is displayed for the sprite
        this.anchor.setTo(player.getHullAsset().anchor);
        this.scale.setTo(player.getHullAsset().scale);

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
