// namespace
var App      = App || {};
App.Bots = App.Bots || {};

App.Bots.Minion = (function () {
    "use strict";

    var fn = function (game, x, y) {
        var class_id = 'minion';

        App.Bot.call(this, game, x, y, class_id);

        this.player          = this.game.global.player;
        this.followingPlayer = false;
        this.followX         = this.game.world.randomX;
        this.followY         = this.game.world.randomY;

        // main gun
        var main_gun = new App.WeaponMinionMainGun(this.game);
        main_gun.createProjectiles(this.getMainGunBulletPoolCount());
        main_gun.trackSprite(this);
        this.addWeapon('main_gun', main_gun);

        // weapon audio events
        main_gun.events.onFire.add((function () {
            this.setEnergy( this.getEnergy() - this.getMainGunBulletEnergyCost() );
        }).bind(this));
    };

    fn.prototype = Object.create(App.Bot.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.tick = function () {
        if (this.alive) {

            if (this.player.alive) {
                if (Math.abs(this.player.body.x - this.body.x) < 200 && Math.abs(this.player.body.y - this.body.y) < 200) {
                    this.followingPlayer = true;
                }
                else if (Math.abs(this.player.body.x - this.body.x) > 450 && Math.abs(this.player.body.y - this.body.y) > 450) {
                    this.followingPlayer = false;
                    this.followX = this.game.world.randomX;
                    this.followY = this.game.world.randomX;
                }

                if (this.followingPlayer) {
                    this.accelerateToObject(this.player, this.getSpeed());  //start accelerateToObject on every bullet
                }
                else {
                    if (Math.abs(this.followX - this.x) < 75 && Math.abs(this.followY - this.y) < 75) {
                        this.followX = (((Math.random() * (.8 - .2) + .2) * this.game.world.width) + this.x) % this.game.world.width;
                        this.followY = (((Math.random() * (.8 - .2) + .2) * this.game.world.height) + this.y) % this.game.world.height;
                    }
                    this.accelerateToPoint(this.followX, this.followY, this.getSpeed() * 0.75);  //start accelerateToObject on every bullet
                }

                if (this.hasLOSWithPlayer()) {
                    if (this.getEnergy() > 0) {
                        // fire main gun
                        this.getWeapon('main_gun').fire();
                    }
                }
            }

            if (this.getEnergyRegenRate() > 0 && this.getEnergy() < this.getMaxEnergy()) {
                this.setEnergy( this.getEnergy() + this.getEnergyRegenRate() );
            }
        }
    };

    return fn;
})();
