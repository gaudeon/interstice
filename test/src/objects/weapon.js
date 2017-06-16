import Weapon from '../../../src/objects/weapon';

let env = require('../../env');
let assets = require('../../assets');
let assert = require('chai').assert;

before(function() {
    return Promise.all([env.game_ready, assets.assets_ready]);
});

// reqs

describe("Weapon", function () {
    let weapon;

    describe("constructor()", function() {
        it("generates an object", function () {
            weapon = new Weapon(game);

            assert.isObject(weapon);
        });
    });
});
