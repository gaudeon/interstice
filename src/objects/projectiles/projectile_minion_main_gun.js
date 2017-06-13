import Projectile from '../projectile';

export default class ProjectileMinionMainGun extends Projectile {
    constructor (game, x, y, collisionManager) {
        let assetsConfig = game.cache.getJSON('assetsConfig');
        let imageKey = assetsConfig.bullet_red.key;

        // call bullet constructor
        super(game, x, y, imageKey, null, collisionManager);

        // config data
        this.config = {};
        this.config.assets = assetsConfig;
        this.config.bots = game.cache.getJSON('botsConfig');

        // setup this projectiles attributes
        this.attributes = this.attributes || {};
        this.attributes.damage = this.config.bots.minion.main_gun.bullet_damage;
        this.attributes.lifespan = this.config.bots.minion.main_gun.bullet_lifespan;
        this.setMass(this.config.bots.minion.main_gun.bullet_mass);

        if (this.config.assets.bullet_red.in_atlas) {
            this.frameName = this.config.assets.bullet_red.frame;
        }

        // setup collisions
        this.collisionManager.addToEnemyProjectilesCG(this);
        this.collisionManager.setCollidesWithPlayersCG(this);
        this.collisionManager.setCollidesWithSectorCG(this);
        this.collisionManager.addCallbackForPlayersCG(this, function (myBody, playerBody) {
            playerBody.sprite.damage(this.attributes.damage);
            this.kill();
        }, this);
        this.collisionManager.addCallbackForPlayerProjectilesCG(this, function (myBody, playerBody) {
            this.kill();
        }, this);
    }
};
