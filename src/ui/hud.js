export default class HUD {
    constructor (game, player) {
        this.game = game;
        this.player = player;

        // config data
        this.config        = {};
        this.config.assets = this.game.cache.getJSON('assetsConfig');
        this.config.hud    = this.game.cache.getJSON('hudConfig');
    }

    loadAssets () {
        _.each(
            _.filter(
                _.keys(this.config.assets),
                (key) => { return key.match(/^ui_/); }
            ),
            (el) => {
                if (!this.config.assets[el].in_atlas) {
                    this.game.load.image(this.config.assets[el].key, this.config.assets[el].file);
                }
            }
        );
    }

    setupHUD () {
        this.hud = this.game.add.group();
        this.hud.fixedToCamera = true;

        _.each(['health_bar', 'energy_bar'], (function (bar) {
            //  bar
            this[bar] = {};

            // health bar background
            this[bar].bg = {};

            var x = this.config.hud[bar].x;
            var y = this.config.hud[bar].y;

            this[bar].bg.left = this.game.add.sprite(x, y, this.config.assets.ui_bar_bg_left.key, this.config.assets.ui_bar_bg_left.frame);
            this[bar].bg.left.alpha = this.config.hud.bar_bg.alpha;
            this.hud.add(this[bar].bg.left);

            x += this[bar].bg.left.width;
            this[bar].bg.mid = this.game.add.sprite(x, y, this.config.assets.ui_bar_bg_mid.key, this.config.assets.ui_bar_bg_mid.frame);
            this[bar].bg.mid.width = bar == 'health_bar' ? this.player.getHullHealth() : this.player.getHullEnergy();
            this[bar].bg.mid.alpha = this.config.hud.bar_bg.alpha;
            this.hud.add(this[bar].bg.mid);

            x += this[bar].bg.mid.width;
            this[bar].bg.right = this.game.add.sprite(x, y, this.config.assets.ui_bar_bg_right.key, this.config.assets.ui_bar_bg_right.frame);
            this[bar].bg.right.alpha = this.config.hud.bar_bg.alpha;
            this.hud.add(this[bar].bg.right);

            // bar foreground
            this[bar].fg = {};

            x = this.config.hud[bar].x;
            y = this.config.hud[bar].y;
            this[bar].fg.left = this.game.add.sprite(x, y, this.config.assets['ui_' + bar + '_left'].key, this.config.assets['ui_' + bar + '_left'].frame);
            this[bar].fg.left.alpha = this.config.hud[bar].alpha;
            this.hud.add(this[bar].fg.left);

            x += this[bar].fg.left.width;
            this[bar].fg.mid = this.game.add.sprite(x, y, this.config.assets['ui_' + bar + '_mid'].key, this.config.assets['ui_' + bar + '_mid'].frame);
            this[bar].fg.mid.width = bar == 'health_bar' ? this.player.getHullHealth() : this.player.getHullEnergy();
            this[bar].fg.mid.alpha = this.config.hud[bar].alpha;
            this.hud.add(this[bar].fg.mid);

            x += this[bar].fg.mid.width;
            this[bar].fg.right = this.game.add.sprite(x, y, this.config.assets['ui_' + bar + '_right'].key, this.config.assets['ui_' + bar + '_right'].frame);
            this[bar].fg.right.alpha = this.config.hud[bar].alpha;
            this.hud.add(this[bar].fg.right);
        }).bind(this));
    }

    tick () {
        _.each(['health_bar', 'energy_bar'], (function (bar) {

            var amount = bar == 'health_bar' ? this.player.getHealth() : this.player.getEnergy();
            if (amount <= 0) { // hide bar if empty
                this[bar].fg.left.visible  = false;
                this[bar].fg.mid.visible   = false;
                this[bar].fg.right.visible = false;
            }
            else {
                this[bar].fg.left.visible  = true;
                this[bar].fg.mid.visible   = true;
                this[bar].fg.right.visible = true;

                this[bar].fg.mid.width = amount;

                var x = this[bar].fg.left.x + this[bar].fg.left.width + this[bar].fg.mid.width;
                var y = this.config.hud[bar].y;
                this[bar].fg.right.reset(x,y);
            }
        }).bind(this));
    }

};
