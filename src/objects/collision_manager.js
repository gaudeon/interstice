// namespace
var App = App || {};

// Collision Manager contains all collision groups and has helper functions to
// add sprites to the various groups or setup collisions with the various groups

App.CollisionManager = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;
    };

    // player_cg
    fn.prototype.getPlayersCG             = function () { return this.getCollisionGroup('players'); };
    fn.prototype.addToPlayersCG           = function (object) { this.addToCollisionGroup('players', object) };
    fn.prototype.setCollidesWithPlayersCG = function (object) { this.setCollidesWithGroup('players', object); };
    fn.prototype.addCallbackForPlayersCG  = function (object, callback, context) { this.addCollisionGroupCallback('players', object, callback, context); };

    // player_projectiles_cg
    fn.prototype.getPlayerProjectilesCG             = function () { return this.getCollisionGroup('player_projectiles'); };
    fn.prototype.addToPlayerProjectilesCG           = function (object) { this.addToCollisionGroup('player_projectiles', object) };
    fn.prototype.setCollidesWithPlayerProjectilesCG = function (object) { this.setCollidesWithGroup('player_projectiles', object); };
    fn.prototype.addCallbackForPlayerProjectilesCG  = function (object, callback, context) { this.addCollisionGroupCallback('player_projectiles', object, callback, context); };

    // enemies_cg
    fn.prototype.getEnemiesCG             = function () { return this.getCollisionGroup('enemies'); };
    fn.prototype.addToEnemiesCG           = function (object) { this.addToCollisionGroup('enemies', object) };
    fn.prototype.setCollidesWithEnemiesCG = function (object) { this.setCollidesWithGroup('enemies', object); };
    fn.prototype.addCallbackForEnemiesCG  = function (object, callback, context) { this.addCollisionGroupCallback('enemies', object, callback, context); };

    // enemy_projectiles_cg
    fn.prototype.getEnemyProjectilesCG             = function () { return this.getCollisionGroup('enemy_projectiles'); };
    fn.prototype.addToEnemyProjectilesCG           = function (object) { this.addToCollisionGroup('enemy_projectiles', object) };
    fn.prototype.setCollidesWithEnemyProjectilesCG = function (object) { this.setCollidesWithGroup('enemy_projectiles', object); };
    fn.prototype.addCallbackForEnemyProjectilesCG  = function (object, callback, context) { this.addCollisionGroupCallback('enemy_projectiles', object, callback, context); };

    // actual functions to keep the above getter/setters more DRY
    fn.prototype.getCollisionGroup = function (key) { return this.cg[key]; };
    fn.prototype.addToCollisionGroup = function (key, object) { object = object.body || object; object.setCollisionGroup(this.cg[key]); };
    fn.prototype.setCollidesWithGroup = function (key, object) { object = object.body || object; object.collides(this.cg[key]); };
    fn.prototype.addCollisionGroupCallback = function (key, object, callback, context) { object = object.body || object; object.createGroupCallback(this.cg[key], callback, context); }

    // It's important that this is run before a given game loop happens so collisions happen against the boundaries of the world appropriately
    fn.prototype.setBounds = function (x,y,width,height) {
        // setup world boundaries - this sets up collsion boundaries for p2 physics as well
        this.game.world.setBounds(x,y,width,height);
        this.game.physics.p2.setBounds(x,y,width,height,true,true,true,true,true);

        // setup collision groups after setting up world boundaries so they are properly registered
        this.cg = {};
        this.cg.players            = this.game.physics.p2.createCollisionGroup();
        this.cg.player_projectiles = this.game.physics.p2.createCollisionGroup();
        this.cg.enemies            = this.game.physics.p2.createCollisionGroup();
        this.cg.enemy_projectiles  = this.game.physics.p2.createCollisionGroup();
    };

    return fn;
})();
