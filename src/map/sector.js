import MinionBot from '../entities/ships/bots/minion';

export default class Sector {
    constructor (scene, player, key) {
        this.scene = scene;
        this.player = player;
        this.key = key;

        // config data
        this.config = this.config || {};
        this.config.assets = this.config.assets || this.scene.cache.json.get('assetsConfig');
        this.config.sectors = this.config.sectors || this.scene.cache.json.get('sectorsConfig');

        // area to hold bots
        this.bots = new Phaser.GameObjects.Group(scene);
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
       this.scene.load.tilemapTiledJSON(tilemap.key, tilemap.jsonFile);

       if (this.sectorConfig().background) {
           var bgAsset = this.backgroundAssetConfig();

           if (!bgAsset.in_atlas) {
               this.scene.load.image(bgAsset.key, bgAsset.file);
           }
       }
    }

    setupSector () {
        // the key of the tilemap for this sector
        let tilemapKey = this.tilemapAssetConfig().key;

        // init map
        this.map = this.scene.make.tilemap({ key: tilemapKey });

        // add tileset images
        this.mapTilesets = {};
        this.tilesetList().forEach(tileset => {
            var config = this.tilesetAssetConfig(tileset);
            this.mapTilesets[tileset] = this.map.addTilesetImage(tileset, config.key);
        });

        // setup tile layers
        this.layers = {};
        let layerDepth = -1 * this.sectorConfig().layers.length; 

        this.sectorConfig().layers.forEach(layer => {
            this.layers[layer.name] = this.map.createDynamicLayer(layer.tilemapIndex, this.mapTilesets[layer.tileset], 0, 0);

            // reverse depth, first layer is deepest depth
            this.layers[layer.name].setDepth(layerDepth);
            layerDepth++;

            // Set colliding tiles before converting the layer to Matter bodies!
            this.layers[layer.name].setCollisionByProperty({ collides: true });

            // Convert the layer. Any colliding tiles will be given a Matter body. If a tile has collision
            // shapes from Tiled, these will be loaded. If not, a default rectangle body will be used. The
            // body will be accessible via tile.physics.matterBody.
            this.scene.matter.world.convertTilemapLayer(this.layers[layer.name]);
        });

        // resize world to match the the tilemap
        this.scene.matter.world.setBounds(this.map.widthInPixels, this.map.heightInPixels);
        this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // apply background
        if (this.sectorConfig().background) {
            this.background = this.scene.add.tileSprite(
                0, 0, this.widthInPixels(), this.heightInPixels(), 
                this.backgroundAssetConfig().key, 
                this.backgroundAssetConfig().in_atlas ? this.backgroundAssetConfig().frame : null 
            );

            // set background as deepest layer
            this.background.setDepth(-1 * (this.sectorConfig().layers.length + 1));
        }

        // setup sector entities (has be be after world boundaries and collisions because of custom collision groups)
        this.setupSectorEntities();
    }

    setupSectorEntities () {
        var entityLayer = this.sectorConfig().object_layers['entities'];

        this.map.objects[entityLayer].objects.forEach(entity => {
            // Phaser uses top left, Tiled bottom left so we have to adjust the y position
            // also keep in mind that the cup images are a bit smaller than the tile which is 16x16
            // so they might not be placed in the exact pixel position as in Tiled
            entity.y -= this.map.tileHeight;

            switch (entity.type) {
                case 'player':
                    this.player.setupShip(entity.x, entity.y);

                    break;
                case 'bot_minion':
                    var bot = new MinionBot(this.scene, entity.x, entity.y, this.player);

                    this.bots.add(bot, true); // add to group and scene

                    break;
                default:
                    break;
            }
        });
    }

    // updates for sector
    tick () {
        this.player.tick();

        /*this.getBots().forEach(bot => {
            bot.tick(bot);
        }, this);*/
    }

    widthInPixels () { return this.map.widthInPixels; }
    heightInPixels () { return this.map.heightInPixels; }

    widthInTiles () { return this.map.width; }
    heightInTiles () { return this.map.height; }

    tileWidth () { return this.map.tileWidth; }
    tileHeight () { return this.map.tileHeight; }

    getBots () { return this.bots.getChildren(); }
    getPlayer () { return this.player; }
};
