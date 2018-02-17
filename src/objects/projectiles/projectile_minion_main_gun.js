import Projectile from '../projectile';

export default class ProjectileMinionMainGun extends Projectile {
    constructor (scene, x, y) {
        let assetsConfig = scene.cache.json.get('assetsConfig');
        let imageKey = assetsConfig.bullet_red.key;

        // call bullet constructor
        super(scene, x, y, imageKey, assetsConfig.bullet_red.in_atlas ? assetsConfig.bullet_red.frame : null);

        // config data
        this.config = {};
        this.config.assets = assetsConfig;
        this.config.bots = scene.cache.json.get('botsConfig');

        // setup this projectiles attributes
        this.attributes = this.attributes || {};
        this.attributes.damage = this.config.bots.minion.main_gun.bullet_damage;
        this.attributes.lifespan = this.config.bots.minion.main_gun.bullet_lifespan;
        this.setMass(this.config.bots.minion.main_gun.bullet_mass);
    }
};
