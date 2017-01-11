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

        // create a shorter accessor to the player object
        this.player = this.game.global.player;
    };

    fn.prototype.preload = function () {
        this.load.image('space', 'assets/images/spaceBGDarkPurple.png');
        this.load.image('player', this.player.getHullAsset().file);
        this.load.image('enemy1', 'assets/images/enemyShipG.png');
        this.load.image('greenLaser', 'assets/images/LaserGreen.png');
        this.load.image('redLaser', 'assets/images/LaserRed.png');
    };

    fn.prototype.create = function () {
        // background
        this.background = this.add.tileSprite(0, 0, this.sector.width, this.sector.height, 'space');
        this.game.world.setBounds(0, 0, this.sector.width, this.sector.height);

        // use p2 for ships
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        // setup player ship spite
        this.player.setShipSprite(this.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'player'));
        this.player_ship = this.player.getShipSprite(); // easier accessor to player ship sprite
        this.player_ship.anchor.setTo(0.5);
        this.player_ship.scale.setTo(0.5);

        this.game.physics.p2.enable(this.player_ship);

        this.enemy1 = this.add.sprite(this.game.world.width / 3, this.game.world.height / 3, 'enemy1');
        this.enemy1.anchor.setTo(0.5);
        this.enemy1.scale.setTo(0.5);

        this.game.physics.p2.enable(this.enemy1);

        this.cursors = game.input.keyboard.createCursorKeys();

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        game.camera.follow(this.player_ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    };

    fn.prototype.update = function () {

        if (this.cursors.up.isDown) {
            this.player_ship.body.thrust(300);
        }
        else if (this.cursors.down.isDown) {
            this.player_ship.body.reverse(300);
        }

        if (this.cursors.left.isDown) {
            this.player_ship.body.rotateLeft(100);
        }
        else if (this.cursors.right.isDown) {
            this.player_ship.body.rotateRight(100);
        }
        else {
            this.player_ship.body.setZeroRotation();
        }

        if (Math.abs(this.player_ship.body.x - this.enemy1.body.x) < 200 && Math.abs(this.player_ship.body.y - this.enemy1.body.y) < 200) {
            this.enemy1.follow = 1;
        }
        if (this.enemy1.follow == 1) {
            accelerateToObject(this.enemy1,this.player_ship,30);  //start accelerateToObject on every bullet
        }
    }

    return fn;
})();
    function accelerateToObject(obj1, obj2, speed) {
        if (typeof speed === 'undefined') { speed = 120; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
        obj1.body.force.y = Math.sin(angle) * speed;
    }
