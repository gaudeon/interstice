import {describe, it} from 'mocha';
import chai from 'chai';
import env from '../../../env';
import WeaponPlayerMainGun from '../../../../src/objects/weapons/weapon_player_main_gun';

const assert = chai.assert;

env.gameReady.then((game) => {
    describe('WeaponPlayerMainGun', () => {
        let weaponPlayerMainGun;

        describe('constructor()', () => {
            it('generates an object', () => {
                weaponPlayerMainGun = new WeaponPlayerMainGun(game);

                assert.isObject(weaponPlayerMainGun);
            });
        });
    });
});
