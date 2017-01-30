// namespace
var App = App || {};

App.Bot = (function () {
    "use strict";

    var fn = function (game, x, y, class_id) {
        var asset_config = game.cache.getJSON('assetsConfig').bots[class_id];

        Phaser.Sprite.call(this, game, x, y, asset_config.key);

        this.game = game;

        // config data
        this.config = game.cache.getJSON('botsConfig');

        // sprite attributes
        this.anchor.setTo(this.config[class_id].sprite.anchor);
        this.scale.setTo(this.config[class_id].sprite.scale);

        // bot attributes
        this.attributes = {};

        // this needs to be set for each bot
        this.attributes.bot_class_id = class_id;

        // setup physics body for this sprite
        this.game.physics.p2.enable(this, false);
        this.body.setRectangle(40, 40);

        // setup collision_group globallly if not there
        this.game.global.collision_manager.addToEnemiesCG(this);
        this.game.global.collision_manager.setCollidesWithPlayersCG(this);
        this.game.global.collision_manager.setCollidesWithPlayerProjectilesCG(this);

        // addition event signals this.events is a Phaser.Events object
        this.events.onCollide = new Phaser.Signal();
    };

    fn.prototype = Object.create(Phaser.Sprite.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.getBotClassId  = function () {
        if ('undefined' === typeof this.attributes.bot_class_id) {
            throw "Bot Class Id is not defined";
        }

        return this.attributes.bot_class_id;
    };

    fn.prototype.getBotConfig      = function () { return this.config[this.getBotClassId()]; };
    fn.prototype.getSpeed          = function () { return this.getBotConfig().speed; };
    fn.prototype.getBulletType     = function () { return this.getBotConfig().bullet; };
    fn.prototype.getCollisionGroup = function () { return this.collision_group; };

    fn.prototype.tick = function () { /* overwrite me to do stuff */ };

    fn.prototype.accelerateToPoint = function (x, y, speed) {
        var speed = speed || this.getBotConfig().speed || 0;

        var angle = Math.atan2(y - this.y, x - this.x);
        this.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
        this.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
        this.body.force.y = Math.sin(angle) * speed;
    };

    fn.prototype.accelerateToObject = function (dest, speed) {
        if ('object' !== typeof dest) return;

        this.accelerateToPoint(dest.x, dest.y, speed);
    };

    return fn;
})();
