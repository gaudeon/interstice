import {describe, it} from 'mocha';
import chai from 'chai';
import env from '../../env';
import Projectile from '../../../src/objects/projectile';

const assert = chai.assert;

env.gameReady.then((game) => {
    describe('Projectile', () => {
        let projectile;

        describe('constructor()', () => {
            it('generates an object', () => {
                projectile = new Projectile(game);

                assert.isObject(projectile);
            });
        });
    });
});
