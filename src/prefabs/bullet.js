// namespace
var App = App || {};
App.PlayMissionState = App.PlayMissionState || {};

var bulletData = [{
    name: 'redLaser',
    audio: 'assets/sounds/lazer1.wav',
    image: 'assets/images/LaserRed.png',
}, {
    name: 'greenLaser',
    audio: 'assets/sounds/lazer1.wav',
    image: 'assets/images/LaserGreen.png',
},
];

App.PlayMissionState.Bullet = (function () {
    "use strict";

    var fn = function (game, state) {
        this.game  = game;
        this.state = state;
        this.bulletData = bulletData;
    };

    return fn;
})();
