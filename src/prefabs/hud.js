// namespace
var App = App || {};

App.HUD = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;
        this.player = this.game.global.player;
    };

    fn.prototype.drawBar = function (x, y, maxHealth, healthbarType, opacity) {
        this.left = this.game.add.sprite(x, y, healthbarType + 'Left');
        this.left.fixedToCamera = true;
        this.left.alpha = opacity;
        this.group.add(this.left);

        var midXPos = x + this.left.width;
        this.mid = this.game.add.sprite(midXPos, y, healthbarType + 'Mid');
        this.mid.fixedToCamera = true;
        this.mid.alpha = opacity;
        this.mid.width = maxHealth;
        this.group.add(this.mid);

        var rightXPos = x + this.mid.width + this.left.width;
        this.right = this.game.add.sprite(rightXPos, y, healthbarType + 'Right');
        this.right.fixedToCamera = true;
        this.right.alpha = opacity;
        this.group.add(this.right);
    };

    fn.prototype.loadAssets = function () {
        this.game.load.image('healthbarBgLeft', 'assets/images/hud_elements/barHorizontal_shadow_left.png');
        this.game.load.image('healthbarBgMid', 'assets/images/hud_elements/barHorizontal_shadow_mid.png');
        this.game.load.image('healthbarBgRight', 'assets/images/hud_elements/barHorizontal_shadow_right.png');
        this.game.load.image('healthbarGreenLeft', 'assets/images/hud_elements/barHorizontal_green_left.png');
        this.game.load.image('healthbarGreenMid', 'assets/images/hud_elements/barHorizontal_green_mid.png');
        this.game.load.image('healthbarGreenRight', 'assets/images/hud_elements/barHorizontal_green_right.png');
        this.game.load.image('healthbarYellowLeft', 'assets/images/hud_elements/barHorizontal_yellow_left.png');
        this.game.load.image('healthbarYellowMid', 'assets/images/hud_elements/barHorizontal_yellow_mid.png');
        this.game.load.image('healthbarYellowRight', 'assets/images/hud_elements/barHorizontal_yellow_right.png');
    };

    fn.prototype.displayHUD = function () {
        this.group = this.game.add.group();

        var x_pos = 5;
        var y_pos = 5;
        var MAX_HEALTH = this.player.getHullHealth();
        var MAX_ENERGY = this.player.getHullEnergy();
        var CUR_HEALTH = this.player.getHullHealthCur();

        // draws the health bar
        this.drawBar(x_pos, y_pos, MAX_HEALTH, 'healthbarBg', 1);
        this.drawBar(x_pos, y_pos, CUR_HEALTH, 'healthbarGreen', 0.5);

        // draws the shield bar
        this.drawBar(x_pos, y_pos + 30, MAX_ENERGY, 'healthbarBg', 1);
        this.drawBar(x_pos, y_pos + 30, MAX_ENERGY, 'healthbarYellow', 0.5);
    };

    return fn;
})();
