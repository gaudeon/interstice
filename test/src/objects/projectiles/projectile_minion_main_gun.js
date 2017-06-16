import {describe, it} from 'mocha';
import chai from 'chai';
import env from '../../../env';
import CollisionManager from '../../../../src/objects/collision_manager';
import ProjectileMinionMainGun from '../../../../src/objects/projectiles/projectile_minion_main_gun';

const assert = chai.assert;

env.gameReady.then((game) => {
    describe('ProjectileMinionMainGun', () => {
        let projectileMinionMainGun;

        let collisionManager = new CollisionManager(game);
        collisionManager.setBounds(0, 0, game.width, game.height);

        describe('constructor()', () => {
            it('generates an object', () => {
                projectileMinionMainGun = new ProjectileMinionMainGun(game, 0, 0, collisionManager);

                assert.isObject(projectileMinionMainGun);
            });
        });
    });
});
