// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas
import Weapon from '../weapon';
import ProjectilePlayerMainGun from '../projectiles/projectile_player_main_gun';

export default class WeaponPlayerMainGun extends Weapon {
    constructor (game, collision_manager) {
        // call bullet constructor
        super(game, collision_manager);

        // config data
        this.config = {};
        this.config.player = game.cache.getJSON('playerConfig');

        // set our projectile to the main gun projectile
        this.projectileClass = ProjectilePlayerMainGun;

        // the default amount of projectiles created
        this.projectileCount = this.config.player.main_gun.bullet_pool_count;

        // delay between shots
        this.shotDelay = this.config.player.main_gun.bullet_shot_delay;

        // how fast does a projectile travel in pixles per second
        this.projectileSpeed = this.config.player.main_gun.bullet_speed;

        // offset angle (in degrees) around the orgin Sprite (in case bullet comes out an an undesired angle from the origin sprite)
        this.projectileAngleOffset = this.config.player.main_gun.bullet_angle_offset;
    }
};
