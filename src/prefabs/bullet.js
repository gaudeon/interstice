// namespace
var App = App || {};

var bulletData = [{
    name: 'redLaser',
    audio: 'laser',
    image: 'redLaser',
}, {
    name: 'greenLaser',
    audio: 'laser',
    image: 'greenLaser',
},
];

App.Bullet = (function () {
    "use strict";

    var fn = function (game) {
        this.game  = game;
        this.bulletData = bulletData;
    };

    fn.prototype.loadAssets = function () {
        // image assets
        this.game.load.image('greenLaser', 'assets/images/LaserGreen.png');
        this.game.load.image('redLaser', 'assets/images/LaserRed.png');

        // audio assets
        this.game.load.audio('laser', 'assets/sounds/laser.wav');
        //console.log("Bullet.loadAssets done!");
    };

    return fn;
})();

//console.log("bullet compiles");
