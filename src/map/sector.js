import MinionBot from '../entities/ships/bots/minion';

export default class Sector {
    constructor (game, player, collisionManager, key) {
        this.game = game;
        this.player = player;
        this.collisionManager = collisionManager;
        this.key = key;

        // config data
        this.config = this.config || {};
        this.config.assets = this.config.assets || game.cache.getJSON('assetsConfig');
        this.config.sectors = this.config.sectors || game.cache.getJSON('sectorsConfig');

        // area to hold bots
        this.bots = new Phaser.Group(this.game);
    }

    sectorConfig () { return this.config.sectors[this.key]; }
    tilemapAssetConfig () {
        const TILEMAP_ASSET_KEY = 'tilemap_' + this.sectorConfig().tilemap;
        return this.config.assets[TILEMAP_ASSET_KEY];
    }
    tilesetList () { return this.sectorConfig().tilesets; }
    tilesetAssetConfig (key) { return this.config.assets[key]; }
    backgroundAssetConfig () {
        const SECTOR_BACKGROUND_KEY = 'background_' + this.sectorConfig().background;
        return this.config.assets[SECTOR_BACKGROUND_KEY];
    }

    loadAssets () {
        _.each(this.tilesetList(), function (tileset) {
            var config = this.tilesetAssetConfig(tileset);
            this.game.load.image(config.key, config.file);
       }.bind(this));

       var tilemap = this.tilemapAssetConfig();
       this.game.load.tilemap(tilemap.key, null, this.game.cache.getJSON(tilemap.jsonKey), Phaser.Tilemap.TILED_JSON);

       if (this.sectorConfig().background) {
           var bgAsset = this.backgroundAssetConfig();
           if (!bgAsset.in_atlas) {
               this.game.load.image(bgAsset.key, bgAsset.file);
           }
       }
    }

    setupSector () {
        // init map
        this.map = this.game.add.tilemap(this.tilemapAssetConfig().key);

        // add tileset images
        _.each(this.tilesetList(), function (tileset) {
            var config = this.tilesetAssetConfig(tileset);
            this.map.addTilesetImage(tileset, config.key);
        }.bind(this));

        // setup tile layers
        this.layers = {};

        _.each(this.sectorConfig().layers, function (layer) {
           this.layers[layer.name] = this.map.createLayer(layer.name);
           this.layers[layer.name].sendToBack();
        }.bind(this));

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
        this.collisionManager.setBounds(0, 0, this.widthInPixels(), this.heightInPixels());

        // setup sector collisions
        this.setupSectorCollisions();

        // setup sector entities (has be be after world boundaries and collisions because of custom collision groups)
        this.setupSectorEntities();
    }

    setupSectorCollisions () {
        _.each(this.sectorConfig().layers, function (layer) {
           if (layer.collisionIds) {
               this.map.setCollision(layer.collisionIds, true, layer.name);

               // needed for p2 physics collisions to work
               var bodies = this.game.physics.p2.convertTilemap(this.map, layer.name);
               _.each(bodies, function (body) {
                   this.collisionManager.addToSectorCG(body);
                   this.collisionManager.setCollidesWithPlayersCG(body);
                   this.collisionManager.setCollidesWithPlayerProjectilesCG(body);
                   this.collisionManager.setCollidesWithEnemiesCG(body);
                   this.collisionManager.setCollidesWithEnemyProjectilesCG(body);
               }.bind(this));
           }
        }.bind(this));
    }

    setupSectorEntities () {
        var entityLayer = this.sectorConfig().object_layers['entities'];

        this.map.objects[entityLayer].forEach(function (entity) {
            // Phaser uses top left, Tiled bottom left so we have to adjust the y position
            // also keep in mind that the cup images are a bit smaller than the tile which is 16x16
            // so they might not be placed in the exact pixel position as in Tiled
            entity.y -= this.map.tileHeight;

            switch (entity.type) {
                case 'player':
                    this.player.setupShip(entity.x, entity.y);

                    break;
                case 'bot_minion':
                    var bot = new MinionBot(this.game, entity.x, entity.y, this.player, this.collisionManager);

                    this.bots.add(this.game.add.existing(bot));

                    // entities are on top
                    this.game.world.bringToTop(bot);

                    break;
                default:
                    break;
            }
        }.bind(this));
    }

    // updates for sector
    tick () {
        this.player.tick();

        this.bots.forEach(function (bot) {
            bot.tick(bot);
        }, this);
    }

    widthInPixels () { return this.map.widthInPixels; }
    heightInPixels () { return this.map.heightInPixels; }

    widthInTiles () { return this.map.width; }
    heightInTiles () { return this.map.height; }

    tileWidth () { return this.map.tileWidth; }
    tileHeight () { return this.map.tileHeight; }

    getBots () { return this.bots; }
    getPlayer () { return this.player; }
};
