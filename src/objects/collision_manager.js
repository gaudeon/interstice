// Collision Manager contains all collision groups and has helper functions to
// add sprites to the various groups or setup collisions with the various groups

export default class CollisionManager {
    constructor (game) {
        this.game = game;
    }

    // player_cg
    getPlayersCG             () { return this.getCollisionGroup('players'); }
    addToPlayersCG           (object) { this.addToCollisionGroup('players', object) }
    setCollidesWithPlayersCG (object) { this.setCollidesWithGroup('players', object); }
    addCallbackForPlayersCG  (object, callback, context) { this.addCollisionGroupCallback('players', object, callback, context); }

    // player_projectiles_cg
    getPlayerProjectilesCG             () { return this.getCollisionGroup('player_projectiles'); }
    addToPlayerProjectilesCG           (object) { this.addToCollisionGroup('player_projectiles', object) }
    setCollidesWithPlayerProjectilesCG (object) { this.setCollidesWithGroup('player_projectiles', object); }
    addCallbackForPlayerProjectilesCG  (object, callback, context) { this.addCollisionGroupCallback('player_projectiles', object, callback, context); }

    // enemies_cg
    getEnemiesCG             () { return this.getCollisionGroup('enemies'); }
    addToEnemiesCG           (object) { this.addToCollisionGroup('enemies', object) }
    setCollidesWithEnemiesCG (object) { this.setCollidesWithGroup('enemies', object); }
    addCallbackForEnemiesCG  (object, callback, context) { this.addCollisionGroupCallback('enemies', object, callback, context); }

    // enemy_projectiles_cg
    getEnemyProjectilesCG             () { return this.getCollisionGroup('enemy_projectiles'); }
    addToEnemyProjectilesCG           (object) { this.addToCollisionGroup('enemy_projectiles', object) }
    setCollidesWithEnemyProjectilesCG (object) { this.setCollidesWithGroup('enemy_projectiles', object); }
    addCallbackForEnemyProjectilesCG  (object, callback, context) { this.addCollisionGroupCallback('enemy_projectiles', object, callback, context); }

    // map_cg
    getSectorCG             () { return this.getCollisionGroup('sector'); }
    addToSectorCG           (object) { this.addToCollisionGroup('sector', object) }
    setCollidesWithSectorCG (object) { this.setCollidesWithGroup('sector', object); }
    addCallbackForSectorCG  (object, callback, context) { this.addCollisionGroupCallback('sector', object, callback, context); }

    // actual functions to keep the above getter/setters more DRY
    getCollisionGroup (key) { return this.cg[key]; }
    addToCollisionGroup (key, object) { object = object.body || object; object.setCollisionGroup(this.cg[key]); }
    setCollidesWithGroup (key, object) { object = object.body || object; object.collides(this.cg[key]); }
    addCollisionGroupCallback (key, object, callback, context) { object = object.body || object; object.createGroupCallback(this.cg[key], callback, context); }

    // It's important that this is run before a given game loop happens so collisions happen against the boundaries of the world appropriately
    setBounds (x,y,width,height) {
        // setup world boundaries - this sets up collsion boundaries for p2 physics as well
        this.game.world.setBounds(x,y,width,height);
        this.game.physics.p2.setBounds(x,y,width,height,true,true,true,true,true);

        // setup collision groups after setting up world boundaries so they are properly registered
        this.cg = {};
        this.cg.players            = this.game.physics.p2.createCollisionGroup();
        this.cg.player_projectiles = this.game.physics.p2.createCollisionGroup();
        this.cg.enemies            = this.game.physics.p2.createCollisionGroup();
        this.cg.enemy_projectiles  = this.game.physics.p2.createCollisionGroup();
        this.cg.sector             = this.game.physics.p2.createCollisionGroup();
    }
};
