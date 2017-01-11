// namespace
var App      = App || {};
App.Bots = App.Bots || {};

App.Bots.Minion = (function () {
    "use strict";

    var fn = function (game, x, y, collision_group, collides) {
        var class_id = 'minion';

        App.Bot.call(this, game, x, y, class_id, collision_group, collides);

        console.log(this);

        this.player          = this.game.global.player;
        this.player_ship     = this.player.getShipSprite();
        this.followingPlayer = false;
        this.followX         = this.game.world.randomX;
        this.followY         = this.game.world.randomY;
    };

    fn.prototype = Object.create(App.Bot.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.move = function () {
        if (Math.abs(this.player_ship.body.x - this.body.x) < 200 && Math.abs(this.player_ship.body.y - this.body.y) < 200) {
            this.followingPlayer = true;
        }
        else if (Math.abs(this.player_ship.body.x - this.body.x) > 450 && Math.abs(this.player_ship.body.y - this.body.y) > 450) {
            this.followingPlayer = false;
            this.followX = this.game.world.randomX;
            this.followY = this.game.world.randomX;
        }

        if (this.followingPlayer) {
            this.accelerateToObject(this.player_ship, this.getSpeed());  //start accelerateToObject on every bullet
        }
        else {
            if (Math.abs(this.followX - this.x) < 75 && Math.abs(this.followY - this.y) < 75) {
                this.followX = (((Math.random() * (.8 - .2) + .2) * this.game.world.width) + this.x) % this.game.world.width;
                this.followY = (((Math.random() * (.8 - .2) + .2) * this.game.world.height) + this.y) % this.game.world.height;
            }
            this.accelerateToPoint(this.followX, this.followY, this.getSpeed() * 0.75);  //start accelerateToObject on every bullet
        }
    };

    return fn;
})();
