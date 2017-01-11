// namespace
var App = App || {};
App.PlayMissionState = App.PlayMissionState || {};

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

App.PlayMissionState.Bullet = (function () {
    "use strict";

    var fn = function (game, state) {
        this.game  = game;
        this.state = state;
        this.bulletData = bulletData;
    };

    return fn;
})();
