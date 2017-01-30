// namespace
var App = App || {};

// Collision Manager contains all collision groups and has helper functions to
// add sprites to the various groups or setup collisions with the various groups

App.CollisionManager = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;
    };

    fn.prototype.getPlayersCG             = function () { return this.getCollisionGroup('players_cg'); };
    fn.prototype.addToPlayersCG           = function (object) { this.addToCollisionGroup('players_cg', object) };
    fn.prototype.setCollidesWithPlayersCG = function (object, callback, context, shape) { this.setCollidesWithGroup('players_cg', object, callback, context, shape); };

    fn.prototype.getPlayerProjectilesCG             = function () { return this.getCollisionGroup('player_projectiles_cg'); };
    fn.prototype.addToPlayerProjectilesCG           = function (object) { this.addToCollisionGroup('player_projectiles_cg', object) };
    fn.prototype.setCollidesWithPlayerProjectilesCG = function (object, callback, context, shape) { this.setCollidesWithGroup('player_projectiles_cg', object, callback, context, shape); };

    fn.prototype.getEnemiesCG             = function () { return this.getCollisionGroup('enemies_cg'); };
    fn.prototype.addToEnemiesCG           = function (object) { this.addToCollisionGroup('enemies_cg', object) };
    fn.prototype.setCollidesWithEnemiesCG = function (object, callback, context, shape) { this.setCollidesWithGroup('enemies_cg', object, callback, context, shape); };

    fn.prototype.getEnemyProjectilesCG             = function () { return this.getCollisionGroup('enemy_projectiles_cg'); };
    fn.prototype.addToEnemyProjectilesCG           = function (object) { this.addToCollisionGroup('enemy_projectiles_cg', object) };
    fn.prototype.setCollidesWithEnemyProjectilesCG = function (object, callback, context, shape) { this.setCollidesWithGroup('enemy_projectiles_cg', object, callback, context, shape); };

    // actual functions to keep the above getter/setters more DRY
    fn.prototype.getCollisionGroup = function (key) { return this[key]; };
    fn.prototype.addToCollisionGroup = function (key, object) { object = object.body || object; object.setCollisionGroup(this[key]); };
    fn.prototype.setCollidesWithGroup = function (key, object, callback, context, shape) { object = object.body || object; object.collides(this[key], callback, context, shape); };

    // It's important that this is run before a given game loop happens so collisions happen against the boundaries of the world appropriately
    fn.prototype.setBounds = function (x,y,width,height) {
        // setup world boundaries - this sets up collsion boundaries for p2 physics as well
        this.game.world.setBounds(x,y,width,height,true,true,true,true,true);
        this.game.physics.p2.setBounds(x,y,width,height,true,true,true,true,true);

        // setup collision groups after setting up world boundaries so they are properly registered
        this.players_cg            = this.game.physics.p2.createCollisionGroup();
        this.player_projectiles_cg = this.game.physics.p2.createCollisionGroup();
        this.enemies_cg            = this.game.physics.p2.createCollisionGroup();
        this.enemy_projectiles_cg  = this.game.physics.p2.createCollisionGroup();
    };

    return fn;
})();
