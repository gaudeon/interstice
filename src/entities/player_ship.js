var App = App || {};

App.PlayerShip = (function () {
    "use strict";

    var fn = function (game, player) {
        // cache game and player objects
        this.game   = game;
        this.player = player;

        // config data
        this.config = {};
        this.config.assets = this.game.cache.getJSON('assetsConfig');
        this.config.player = this.game.cache.getJSON('playerConfig');

        // call sprite constructor
        var ship_hull_asset = this.config.assets.player.hulls[this.player.getHullId()];
        Phaser.Sprite.call(this, game, game.world.width / 2, game.world.height / 2, ship_hull_asset.key);

        // set how the graphic is displayed for the sprite
        this.anchor.setTo(player.getHullSpriteConfig().anchor);
        this.scale.setTo(player.getHullSpriteConfig().scale);

        game.physics.p2.enable(this, false);
        this.body.setRectangle(40, 40);
        this.body.rotation = this.game.math.PI2 / 4;

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

        // setup ship weapons
        this.weapon_registry = {};

        // main gun
        var main_gun               = this.game.plugins.add(Phaser.Weapon);
        main_gun._bulletClass      = App.Bullet;
        main_gun.bulletKillType    = Phaser.Weapon.KILL_WORLD_BOUNDS;
        main_gun.bulletAngleOffset = this.player.getMainGunBulletAngleOffset();
        main_gun.fireRate          = this.player.getMainGunBulletFireRate();

        main_gun.trackSprite(this);
        main_gun.createBullets(this.player.getMainGunBulletPoolCount(), this.config.assets.bullets[this.player.getMainGunBulletType()].key);
        this.weapon_registry['main_gun'] = main_gun;

        // new main gun
        var p_main_gun = new App.WeaponMainGun(this.game, this.player, 'player_main_gun');
        p_main_gun.createProjectiles(this.player.getMainGunBulletPoolCount());
        p_main_gun.shotDelay       = this.player.getMainGunBulletFireRate();
        p_main_gun.projectileSpeed = this.player.getMainGunBulletSpeed();
        p_main_gun.trackSprite(this);
        this.weapon_registry['p_main_gun'] = p_main_gun;
    };

    fn.prototype = Object.create(Phaser.Sprite.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.getWeapon = function (key) {
        if (!this.weapon_registry[key]) return;

        return this.weapon_registry[key];
    }

    fn.prototype.getCollisionGroup = function() { return this.collision_group; };

    return fn;
})();
