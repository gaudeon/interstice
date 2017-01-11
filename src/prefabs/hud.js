// namespace
var App = App || {};

App.HUD = (function () {
    "use strict";

    var fn = function (game) {
        this.game = game;
    };

    fn.prototype.loadAssets = function () {
        this.game.load.image('healthbarBgLeft', 'assets/images/hud_elements/barHorizontal_shadow_left.png');
        this.game.load.image('healthbarBgMid', 'assets/images/hud_elements/barHorizontal_shadow_mid.png');
        this.game.load.image('healthbarBgRight', 'assets/images/hud_elements/barHorizontal_shadow_right.png');
        this.game.load.image('healthbarGreenLeft', 'assets/images/hud_elements/barHorizontal_green_left.png');
        this.game.load.image('healthbarGreenMid', 'assets/images/hud_elements/barHorizontal_green_mid.png');
        this.game.load.image('healthbarGreenRight', 'assets/images/hud_elements/barHorizontal_green_right.png');
    };

    fn.prototype.displayHUD = function () {
        this.group = this.game.add.group();

        var healthbarXPos = 5;
        var healthbarYPos = 5;

        this.healthbarBgLeft = this.game.add.sprite(healthbarXPos, healthbarYPos, 'healthbarBgLeft');
        this.healthbarBgLeft.fixedToCamera = true;
        this.group.add(this.healthbarBgLeft);

        this.healthbarBgMid = this.game.add.sprite(healthbarXPos + this.healthbarBgLeft.width, healthbarYPos, 'healthbarBgMid');
        this.healthbarBgMid.fixedToCamera = true;
        this.healthbarBgMid.width = 400;
        this.group.add(this.healthbarBgMid);

        this.healthbarBgRight = this.game.add.sprite(healthbarXPos + this.healthbarBgMid.width + this.healthbarBgLeft.width, healthbarYPos, 'healthbarBgRight');
        this.healthbarBgRight.fixedToCamera = true;
        this.group.add(this.healthbarBgRight);
    };

    return fn;
})();
