// namespace
var App = App || {};

// Note: Bullets need to be used by a weapon, arcade physics will be applied object instanciated with this clas

App.WeaponMainGun = (function () {
    "use strict";

    var fn = function (game, parent, name) {
        name = name || 'weapon';

        // call bullet constructor
        App.Weapon.call(this, game, parent, name);

        // set our projectile to the main gun projectile
        this.projectileClass = App.ProjectileMainGun;
    };

    fn.prototype = Object.create(App.Weapon.prototype);
    fn.prototype.constructor = fn;

    return fn;
})();
