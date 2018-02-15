import MinionBot from '../entities/ships/bots/minion';

export default class Sector {
    constructor (scene, player, collisionManager, key) {
        this.scene = scene;
        this.player = player;
        this.collisionManager = collisionManager;
        this.key = key;

        // config data
        this.config = this.config || {};
        this.config.assets = this.config.assets || this.scene.cache.json.get('assetsConfig');
        this.config.sectors = this.config.sectors || this.scene.cache.json.get('sectorsConfig');

        // area to hold bots
        this.bots = new Phaser.GameObjects.Group(this.scene);
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
        this.tilesetList().forEach(tileset => {
            var config = this.tilesetAssetConfig(tileset);
            this.scene.load.image(config.key, config.file);
       });

       var tilemap = this.tilemapAssetConfig();
       this.scene.cache.tilemap.add(tilemap.key, { format: Phaser.Tilemaps.Formats.TILED_JSON, data: this.scene.cache.json.get(tilemap.jsonKey) });

       if (this.sectorConfig().background) {
           var bgAsset = this.backgroundAssetConfig();

           if (!bgAsset.in_atlas) {
               this.scene.load.image(bgAsset.key, bgAsset.file);
           }
       }
    }

    setupSector () {
        // init map
        this.map = this.scene.add.tilemap(this.tilemapAssetConfig().key);

        // add tileset images
        this.tilesetList().forEach(tileset => {
            var config = this.tilesetAssetConfig(tileset);
            this.map.addTilesetImage(tileset, config.key);
        });

        // setup tile layers
        this.layers = {};

        this.sectorConfig().layers.forEach(layer => {
           this.layers[layer.name] = this.map.createLayer(layer.name);
           this.layers[layer.name].sendToBack();
        });

        // TODO: setup  object layers

        // resize world to match the first layer (considered the base layer)
        this.layers[this.sectorConfig().layers[0].name].resizeWorld();

        // apply background
        if (this.sectorConfig().background) {
            this.background = this.scene.add.tileSprite(0, 0, this.widthInPixels(), this.heightInPixels(), this.backgroundAssetConfig().key);
            if (this.backgroundAssetConfig().in_atlas) {
                this.background.frameName = this.backgroundAssetConfig().frame;
            }

            //this.game.world.sendToBack(this.background);
        }

        // setup world boundaries
        this.collisionManager.setBounds(0, 0, this.widthInPixels(), this.heightInPixels());

        // setup sector collisions
        this.setupSectorCollisions();

        // setup sector entities (has be be after world boundaries and collisions because of custom collision groups)
        this.setupSectorEntities();
    }

    setupSectorCollisions () {
        this.sectorConfig().layers.forEach(layer => {
           if (layer.collisionIds) {
               this.map.setCollision(layer.collisionIds, true, layer.name);

               // needed for p2 physics collisions to work
               var bodies = this.scene.physics.matter.convertTilemap(this.map, layer.name);
               bodies.forEach(body => {
                   this.collisionManager.addToSectorCG(body);
                   this.collisionManager.setCollidesWithPlayersCG(body);
                   this.collisionManager.setCollidesWithPlayerProjectilesCG(body);
                   this.collisionManager.setCollidesWithEnemiesCG(body);
                   this.collisionManager.setCollidesWithEnemyProjectilesCG(body);
               });
           }
       });
    }

    setupSectorEntities () {
        var entityLayer = this.sectorConfig().object_layers['entities'];

        this.map.objects[entityLayer].forEach(entity => {
            // Phaser uses top left, Tiled bottom left so we have to adjust the y position
            // also keep in mind that the cup images are a bit smaller than the tile which is 16x16
            // so they might not be placed in the exact pixel position as in Tiled
            entity.y -= this.map.tileHeight;

            switch (entity.type) {
                case 'player':
                    this.player.setupShip(entity.x, entity.y);

                    break;
                case 'bot_minion':
                    var bot = new MinionBot(this.scene, entity.x, entity.y, this.player, this.collisionManager);

                    this.bots.add(this.scene.add.existing(bot));

                    // entities are on top
                    //this.game.world.bringToTop(bot);

                    break;
                default:
                    break;
            }
        });
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
