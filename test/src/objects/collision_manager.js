import {before, describe, it} from 'mocha';
import chai from 'chai';
import env from '../../env';
import CollisionManager from '../../../src/objects/collision_manager';

const assert = chai.assert;

before(() => {
    return Promise.all([env.gameReady]);
});

describe('CollisionManager', () => {
    let collisionManager;

    describe('constructor()', () => {
        it('generates an object', () => {
            collisionManager = new CollisionManager(env.game);

            assert.isObject(collisionManager);
        });
    });
});
