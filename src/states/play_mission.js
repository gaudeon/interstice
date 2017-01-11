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
        this.hud = new App.HUD(this.game);

        this.bots_config = this.game.cache.getJSON('botsConfig');

        this.sector = {
            name: "Test Sector",
            width: this.game.world.width * 2,
            height: this.game.world.height * 2
        };

        // create a shorter accessor to the player object
        this.player = this.game.global.player;
    };

    fn.prototype.preload = function () {
        // Run Bullet preloads once
        var bullet = new App.Bullet(this.game);
        bullet.loadAssets();

        // image assets
        this.load.image('space', 'assets/images/spaceBGDarkPurple.png');
        this.load.image('player', this.player.getHullAsset().file);

        // bot assets TODO: only load bot assets we use on a stage
        var image_key_prefix = game.cache.getJSON('assetsConfig').bot_image_key_prefix;
        console.log(image_key_prefix);
        _.each(_.keys(this.bots_config), (function (bot_class_id) {
            this.load.image(image_key_prefix + bot_class_id, this.bots_config[bot_class_id].asset.file);
        }).bind(this));

        // audio assets
        this.game.load.audio('thrust', 'assets/sounds/thrust.wav');

        // hud assets
        this.hud.loadAssets();
    };

    fn.prototype.create = function () {
        // background
        this.background = this.add.tileSprite(0, 0, this.sector.width, this.sector.height, 'space');
        this.game.world.setBounds(0, 0, this.sector.width, this.sector.height);

        // use p2 for ships
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        var playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        var enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();

        this.game.physics.p2.updateBoundsCollisionGroup();

        // setup player ship spite
        this.player.setShipSprite(this.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'player'));
        this.player_ship = this.player.getShipSprite(); // easier accessor to player ship sprite
        this.player_ship.anchor.setTo(this.player.getHullAsset().anchor);
        this.player_ship.scale.setTo(this.player.getHullAsset().scale);

        this.game.physics.p2.enable(this.player_ship, false);
        this.player_ship.body.setRectangle(40, 40);
        this.player_ship.fixedRotation = true;
        this.player_ship.firing = false;

        this.player_ship.body.setCollisionGroup(playerCollisionGroup);
        this.player_ship.body.collides(enemyCollisionGroup, this.hitEnemy, this);
        this.player_ship.body.onBeginContact.add(this.contactHandler, this);

        // setup an enemy
        this.minion1 = this.add.existing(new App.Bots.Minion(this.game, this.game.world.width / 3, this.game.world.height / 3, enemyCollisionGroup, [playerCollisionGroup]));

        // hud
        this.hud.displayHUD();

        this.keyboard = game.input.keyboard.createCursorKeys();
        this.keyboard.space = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        //  Notice that the sprite doesn't have any momentum at all,
        //  it's all just set by the camera follow type.
        //  0.1 is the amount of linear interpolation to use.
        //  The smaller the value, the smooth the camera (and the longer it takes to catch up)
        game.camera.follow(this.player_ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

        // Audio
        var thrustSound = this.game.add.audio('thrust');
        this.keyboard.up.onDown.add(function() {
            thrustSound.play();
        });
        this.keyboard.up.onUp.add(function() {
            thrustSound.stop();
        });
        this.keyboard.down.onDown.add(function() {
            thrustSound.play();
        });
        this.keyboard.down.onUp.add(function() {
            thrustSound.stop();
        });
    };

    fn.prototype.contactHandler = function (body, shape1, shape2, equation) {
        var x = 0;
        var y = 0;
        //console.log(typeof body);
        if (body && body !== 'null' && body !== 'undefined') {
            x = body.velocity.x;
            y = body.velocity.y;
        }

        var v1 = new Phaser.Point(this.player_ship.body.velocity.x, this.player_ship.body.velocity.y);
        var v2 = new Phaser.Point(x, y);

        var xdiff = Math.abs(v1.x - v2.x);
        var ydiff = Math.abs(v1.y - v2.y);
        console.log(xdiff);
        console.log(ydiff);
        var curhealth = this.player.getHullHealthCur();
        if (xdiff > 500 || ydiff > 500) { //Massive damage!
            this.player.setHullHealthCur(curhealth - 20);
            this.hud.displayHUD();
        } else if (xdiff > 200 || ydiff > 200) { //Slight damage
            this.player.setHullHealthCur(curhealth - 10);
            this.hud.displayHUD();
        }
    }

    fn.prototype.update = function () {
        if (this.keyboard.space.onDown) {
            // this.firing = true;
            // this.bullet.create('Green Laser');
            // this.firing = true;
        }

        if (this.keyboard.up.isDown) {
            this.player_ship.body.thrust(this.player.getHullThrust());
        }
        else if (this.keyboard.down.isDown) {
            this.player_ship.body.reverse(this.player.getHullThrust());
        }

        if (this.keyboard.left.isDown) {
            this.player_ship.body.rotateLeft(this.player.getHullRotation());
        }
        else if (this.keyboard.right.isDown) {
            this.player_ship.body.rotateRight(this.player.getHullRotation());
        }
        else {
            this.player_ship.body.setZeroRotation();
        }

        this.minion1.move();
    }

    fn.prototype.hitEnemy = function(player, enemy) {
        console.log('collision detected');
    }

    fn.prototype.accelerateToObject = function(obj1, obj2, speed) {
        var x;
        var y;
        if (typeof obj2 === 'undefined') {
            x = obj1.followx;
            y = obj1.followy;
        } else {
            x = obj2.x;
            y = obj2.y;
        }
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(y - obj1.y, x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject
        obj1.body.force.y = Math.sin(angle) * speed;
    }

    return fn;
})();
