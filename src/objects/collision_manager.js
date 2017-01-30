// namespace
var App = App || {};

// Collision Manager contains all collision groups and has helper functions to
// add sprites to the various groups or setup collisions with the various groups

App.CollisionManager = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;
    };

    fn.prototype.getPlayersCG             = function () { return this.players_cg; };
    fn.prototype.addToPlayersCG           = function (object) { object = object.body || object; object.setCollisionGroup(this.players_cg); };
    fn.prototype.setCollidesWithPlayersCG = function (object) { object = object.body || object; object.collides(this.players_cg); };

    fn.prototype.getPlayerProjectilesCG             = function () { return this.player_projectiles; };
    fn.prototype.addToPlayerProjectilesCG           = function (object) { object = object.body || object; object.setCollisionGroup(this.player_projectiles_cg); };
    fn.prototype.setCollidesWithPlayerProjectilesCG = function (object) { object = object.body || object; object.collides(this.player_projectiles_cg); };

    fn.prototype.getEnemiesCG             = function () { return this.enemies; };
    fn.prototype.addToEnemiesCG           = function (object) { object = object.body || object; object.setCollisionGroup(this.enemies_cg); };
    fn.prototype.setCollidesWithEnemiesCG = function (object) { object = object.body || object; object.collides(this.enemies_cg); };

    fn.prototype.getEnemyProjectilesCG             = function () { return this.enemy_projectiles; };
    fn.prototype.addToEnemyProjectilesCG           = function (object) { object = object.body || object; object.setCollisionGroup(this.enemy_projectiles_cg); };
    fn.prototype.setCollidesWithEnemyProjectilesCG = function (object) { object = object.body || object; object.collides(this.enemy_projectiles_cg); };

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
