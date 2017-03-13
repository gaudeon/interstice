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
    };

    fn.prototype.update = function () {
        this.mission.tick();

        this.hud.tick();

        // TODO: move this into mission as objective that when complete fires a success or failure signal. Then we add a signal callback in this state to change to the next state
        var still_has_enemies = false;
        this.mission.sector.getBots().forEach((function (bot) {
            if (bot.isEnemy(this.mission.sector.getPlayer()) && bot.alive) {
                still_has_enemies = true;
            }
        }).bind(this));

        if (!this.mission.player.alive || !still_has_enemies) {
            this.state.start('MainMenu');
        }
    };

    return fn;
})();
