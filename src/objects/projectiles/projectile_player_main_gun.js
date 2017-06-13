import Projectile from '../projectile';

export default class ProjectilePlayerMainGun extends Projectile {
    constructor (game, x, y, collisionManager) {
        let assetsConfig = game.cache.getJSON('assetsConfig');
        let imageKey = assetsConfig.bullet_green.key;

        // call bullet constructor
        super(game, x, y, imageKey, null, collisionManager);

        // config data
        this.config = {};
        this.config.assets = assetsConfig;
        this.config.player = game.cache.getJSON('playerConfig');

        // setup this projectiles attributes
        this.attributes = this.attributes || {};
        this.attributes.damage = this.config.player.main_gun.bullet_damage;
        this.attributes.lifespan = this.config.player.main_gun.bullet_lifespan;
        this.attributes.mass = this.config.player.main_gun.bullet_mass;

        if (this.config.assets.bullet_green.in_atlas) {
            this.frameName = this.config.assets.bullet_green.frame;
        }

        // setup collisions
        this.collisionManager.addToPlayerProjectilesCG(this);
        this.collisionManager.setCollidesWithEnemiesCG(this);
        this.collisionManager.setCollidesWithSectorCG(this);
        this.collisionManager.addCallbackForEnemiesCG(this, function (myBody, enemyBody) {
            enemyBody.sprite.damage(this.attributes.damage);
            this.kill();
        }, this);
        this.collisionManager.addCallbackForEnemyProjectilesCG(this, function (myBody, playerBody) {
            this.kill();
        }, this);
    }
};
