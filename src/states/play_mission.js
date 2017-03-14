// namespace
var App = App || {};

App.PlayMissionState = (function () {
    "use strict";

    var fn = function (game) {
        Phaser.State.call(this, game);
    };

    fn.prototype = Object.create(Phaser.State.prototype);
    fn.prototype.constructor = fn;

    fn.prototype.init = function (mission) {
        // for now default mission to KillMinionsMission
        if ("undefined" === typeof mission) {
            mission = "KillMinionsMission";
        }

        // load mission
        var mission_object = eval("App." + mission);
        if ("undefined" === typeof mission_object) {
            mission_object = App.KillMinionsMission;
        }

        this.mission = new mission_object(this.game);

        // setup hud
        this.hud = new App.HUD(this.game, this.mission.getPlayer());
    };

    fn.prototype.preload = function () {
        // mission assets
        this.mission.loadAssets();

        // hud assets
        this.hud.loadAssets();
    };

    fn.prototype.create = function () {
        // mission
        this.mission.setupMission();

        // hud
        this.hud.setupHUD();

        // define what happens when player successfully completes mission
        this.mission.events.onSuccess.add((function () {
            this.state.start('MainMenu');
        }).bind(this));

        // define what happens when a player fails to complete a mission
        this.mission.events.onFailure.add((function () {
            this.state.start('MainMenu');
        }).bind(this));
    };

    fn.prototype.update = function () {
        this.mission.tick();

        this.hud.tick();
    };

    return fn;
})();
