import Projectile from '../projectile';

export default class ProjectilePlayerMainGun extends Projectile {
    constructor (scene, x, y) {
        let assetsConfig = scene.cache.json.get('assetsConfig');
        let imageKey = assetsConfig.bullet_green.key;

        // call bullet constructor
        super(scene, x, y, imageKey, assetsConfig.bullet_green.in_atlas ? assetsConfig.bullet_green.frame : null);

        // config data
        this.config = {};
        this.config.assets = assetsConfig;
        this.config.player = scene.cache.json.get('playerConfig');

        // setup this projectiles attributes
        this.attributes = this.attributes || {};
        this.attributes.damage = this.config.player.main_gun.bullet_damage;
        this.attributes.lifespan = this.config.player.main_gun.bullet_lifespan;
        this.setBounce(this.config.player.main_gun.bullet_bounce);
    }
};
