// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas
import Weapon from '../weapon';
import ProjectileMinionMainGun from '../projectiles/projectile_minion_main_gun';

export default class WeaponMinionMainGun extends Weapon {
    constructor (scene) {
        // call bullet constructor
        super(scene);

        // config data
        this.config = {};
        this.config.bots = scene.cache.json.get('botsConfig');

        // the default amount of projectiles created
        this.projectileCount = this.config.bots.minion.main_gun.bullet_pool_count;

        // delay between shots
        this.shotDelay = this.config.bots.minion.main_gun.bullet_shot_delay;

        // how fast does a projectile travel in pixles per second
        this.projectileSpeed = this.config.bots.minion.main_gun.bullet_speed;

        // offset angle (in degrees) around the orgin Sprite (in case bullet comes out an an undesired angle from the origin sprite)
        this.projectileAngleOffset = this.config.bots.minion.main_gun.bullet_angle_offset;
    }

    projectileClass () { return ProjectileMinionMainGun; }
};
