// namespace
var App = App || {};

App.Sector = (function () {
    "use strict";

    var fn = function (game, player, collision_manager, key) {
        this.game   = game;
        this.player = player;
        this.gcm    = collision_manager;
        this.key    = key;

        // config data
        this.config          = this.config          || {};
        this.config.assets   = this.config.assets   || game.cache.getJSON('assetsConfig');
        this.config.sectors  = this.config.sectors  || game.cache.getJSON('sectorsConfig');

        // area to hold bots
        this.bots = new Phaser.Group(this.game);
    };

    fn.prototype.sectorConfig          = function () { return this.config.sectors[this.key]; };
    fn.prototype.tilemapAssetConfig    = function () { return this.config.assets.tilemaps[this.sectorConfig().tilemap]; };
    fn.prototype.tilesetList           = function () { return this.sectorConfig().tilesets; };
    fn.prototype.tilesetAssetConfig    = function (key) { return this.config.assets.tilesets[key]; };
    fn.prototype.backgroundAssetConfig = function () { return this.config.assets.backgrounds[this.sectorConfig().background]; };

    fn.prototype.loadAssets = function () {
        var tilesets = this.sectorConfig().tilesets;
        _.each(this.tilesetList(), (function (tileset) {
            var config = this.tilesetAssetConfig(tileset);
            this.game.load.image(config.key, config.file);
       }).bind(this));

       var tilemap = this.tilemapAssetConfig();
       this.game.load.tilemap(tilemap.key, tilemap.file, null, Phaser.Tilemap.TILED_JSON);

       if (this.sectorConfig().background) {
           var bg_asset = this.backgroundAssetConfig();
           if ( !bg_asset.in_atlas) {
               this.game.load.image(bg_asset.key, bg_asset.file);
           }
       }
    };

    fn.prototype.setupSector = function () {
        // init map
        this.map = this.game.add.tilemap(this.tilemapAssetConfig().key);

        // add tileset images
        _.each(this.tilesetList(), (function (tileset) {
            var config = this.tilesetAssetConfig(tileset);
            this.map.addTilesetImage(tileset, config.key);
        }).bind(this));

        // setup tile layers
        this.layers = {};

        _.each(this.sectorConfig().layers, (function (layer) {
           this.layers[layer.name] = this.map.createLayer(layer.name);
           this.layers[layer.name].sendToBack();
        }).bind(this));

        // TODO: setup  object layers

        // resize world to match the first layer (considered the base layer)
        this.layers[this.sectorConfig().layers[0].name].resizeWorld();

        // apply background
        if (this.sectorConfig().background) {
            this.background = this.game.add.tileSprite(0, 0, this.widthInPixels(), this.heightInPixels(), this.backgroundAssetConfig().key);
            if (this.backgroundAssetConfig().in_atlas) {
                this.background.frameName = this.backgroundAssetConfig().frame;
            }

            this.game.world.sendToBack(this.background);
        }

        // setup world boundaries
        this.gcm.setBounds(0, 0, this.widthInPixels(), this.heightInPixels());

        // setup sector collisions
        this.setupSectorCollisions();

        // setup sector entities (has be be after world boundaries and collisions because of custom collision groups)
        this.setupSectorEntities();
    };

    fn.prototype.setupSectorCollisions = function () {
        _.each(this.sectorConfig().layers, (function (layer) {
           if (layer.collisionIds) {
               this.map.setCollision(layer.collisionIds, true, layer.name);

               // needed for p2 physics collisions to work
               var bodies = this.game.physics.p2.convertTilemap(this.map, layer.name);
               _.each(bodies, (function (body) {
                   this.gcm.addToSectorCG(body);
                   this.gcm.setCollidesWithPlayersCG(body);
                   this.gcm.setCollidesWithPlayerProjectilesCG(body);
                   this.gcm.setCollidesWithEnemiesCG(body);
                   this.gcm.setCollidesWithEnemyProjectilesCG(body);
               }).bind(this));
           }
        }).bind(this));
    };

    fn.prototype.setupSectorEntities = function () {
        var entity_layer = this.sectorConfig().object_layers['entities'];

        this.map.objects[entity_layer].forEach((function(entity) {
            console.log(entity);
            //Phaser uses top left, Tiled bottom left so we have to adjust the y position
            //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
            //so they might not be placed in the exact pixel position as in Tiled
            entity.y -= this.map.tileHeight;

            switch (entity.type) {
                case 'player':
                    this.player.setupShip(entity.x, entity.y);

                    break;
                case 'bot_minion':
                    var bot = new App.Bots.Minion(this.game, entity.x, entity.y);

                    this.bots.add(this.game.add.existing(bot));

                    // entities are on top
                    this.game.world.bringToTop(bot);

                    break;
                default:
                    break;
            }
        }).bind(this));
    };

    // updates for sector
    fn.prototype.tick = function () {
        this.player.tick();

        this.bots.forEach(function (bot) {
            bot.tick(bot);
        }, this);
    };

    fn.prototype.widthInPixels  = function () { return this.map.widthInPixels; };
    fn.prototype.heightInPixels = function () { return this.map.heightInPixels; };

    fn.prototype.widthInTiles  = function () { return this.map.width; };
    fn.prototype.heightInTiles = function () { return this.map.height; };

    fn.prototype.tileWidth  = function () { return this.map.tileWidth; };
    fn.prototype.tileHeight = function () { return this.map.tileHeight; };

    return fn;
})();
