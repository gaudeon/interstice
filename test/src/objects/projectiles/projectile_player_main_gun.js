import {describe, it} from 'mocha';
import chai from 'chai';
import env from '../../../env';
import CollisionManager from '../../../../src/objects/collision_manager';
import ProjectilePlayerMainGun from '../../../../src/objects/projectiles/projectile_player_main_gun';

const assert = chai.assert;

env.gameReady.then((game) => {
    describe('ProjectilePlayerMainGun', () => {
        let projectilePlayerMainGun;

        let collisionManager = new CollisionManager(game);
        collisionManager.setBounds(0, 0, game.width, game.height);

        describe('constructor()', () => {
            it('generates an object', () => {
                projectilePlayerMainGun = new ProjectilePlayerMainGun(game, 0, 0, collisionManager);

                assert.isObject(projectilePlayerMainGun);
            });
        });
    });
});
