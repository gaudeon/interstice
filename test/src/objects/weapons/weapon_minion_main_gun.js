import {describe, it} from 'mocha';
import chai from 'chai';
import env from '../../../env';
import WeaponMinionMainGun from '../../../../src/objects/weapons/weapon_minion_main_gun';

const assert = chai.assert;

env.gameReady.then((game) => {
    describe('WeaponMinionMainGun', () => {
        let weaponMinionMainGun;

        describe('constructor()', () => {
            it('generates an object', () => {
                weaponMinionMainGun = new WeaponMinionMainGun(game);

                assert.isObject(weaponMinionMainGun);
            });
        });
    });
});
