// namespace
var App = App || {};

App.PlayMissionState = (function () {
    "use strict";

    var fn = function (game) {
        Phaser.State.call(this, game);
    };

    fn.prototype = Object.create(Phaser.State.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.init = function () {
        this.sector = {
            name: "Test Sector",
            width: this.game.world.width * 2,
            height: this.game.world.height * 2
        };
    };

    fn.prototype.preload = function () {
        this.load.image('space', 'assets/images/spaceBGDarkPurple.png');
        this.load.image('player', 'assets/images/playerShipO.png');
        this.load.image('green laser', 'assets/images/playerLaserGreen.png');
    };

    fn.prototype.create = function () {
        // background
        this.background = this.add.tileSprite(0, 0, this.sector.width, this.sector.height, 'space');
        this.game.world.setBounds(0, 0, this.sector.width, this.sector.height);

        // use p2 for ships
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        this.player = this.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'player');
        this.player.anchor.setTo(0.5);
        this.player.scale.setTo(0.5);

        this.game.physics.p2.enable(this.player);

        this.cursors = game.input.keyboard.createCursorKeys();

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    };

    fn.prototype.update = function () {

        if (this.cursors.up.isDown) {
            this.player.body.thrust(300);
        }
        else if (this.cursors.down.isDown) {
            this.player.body.reverse(300);
        }

        if (this.cursors.left.isDown) {
            this.player.body.rotateLeft(100);
        }
        else if (this.cursors.right.isDown) {
            this.player.body.rotateRight(100);
        }
        else {
            this.player.body.setZeroRotation();
        }
    }

    return fn;
})();
