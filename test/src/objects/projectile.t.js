let env    = require("../../env"),
    assets = require("../../assets"),
    assert = require("chai").assert;

before(function() {
    return Promise.all([env.game_ready, assets.assets_ready]);
});

// reqs
import Projectile from "../../../src/objects/projectile";

describe("Projectile", function () {
    let projectile;

    describe("constructor()", function() {
        it("generates an object", function () {
            projectile = new Projectile(game);

            assert.isObject(projectile);
        });
    });
});
