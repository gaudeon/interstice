export default class HUD {
    constructor (scene, mission) {
        this.scene = scene;
        this.mission = mission;
        console.log(scene, mission);

        // config data
        this.config = {};
        this.config.assets = this.scene.cache.json.get('assetsConfig');
        this.config.hud = this.scene.cache.json.get('hudConfig');
    }

    loadAssets () {
        _.each(
            _.filter(
                _.keys(this.config.assets),
                (key) => { return key.match(/^ui_/); }
            ),
            (el) => {
                if (!this.config.assets[el].in_atlas) {
                    this.scene.load.image(this.config.assets[el].key, this.config.assets[el].file);
                }
            }
        );
    }

    setupHUD () {
        this.hud = this.scene.add.group();

        ['health_bar', 'energy_bar'].forEach(bar => {
            //  bar
            this[bar] = {};

            // health bar background
            this[bar].bg = {};

            var x = this.config.hud[bar].x;
            var y = this.config.hud[bar].y;

            this[bar].bg.left = this.scene.add.sprite(x, y, this.config.assets.ui_bar_bg_left.key, this.config.assets.ui_bar_bg_left.frame);
            this[bar].bg.left.setAlpha(this.config.hud.bar_bg.alpha);
            this.hud.add(this[bar].bg.left);

            x += this[bar].bg.left.width;
            this[bar].bg.mid = this.scene.add.sprite(x, y, this.config.assets.ui_bar_bg_mid.key, this.config.assets.ui_bar_bg_mid.frame);
            this[bar].bg.mid.width = bar === 'health_bar' ? this.mission.getPlayer().getChasisHealth() : this.mission.getPlayer().getChasisEnergy();
            this[bar].bg.mid.setAlpha(this.config.hud.bar_bg.alpha);
            this.hud.add(this[bar].bg.mid);

            x += this[bar].bg.mid.width;
            this[bar].bg.right = this.scene.add.sprite(x, y, this.config.assets.ui_bar_bg_right.key, this.config.assets.ui_bar_bg_right.frame);
            this[bar].bg.right.setAlpha(this.config.hud.bar_bg.alpha);
            this.hud.add(this[bar].bg.right);

            // bar foreground
            this[bar].fg = {};

            x = this.config.hud[bar].x;
            y = this.config.hud[bar].y;
            this[bar].fg.left = this.scene.add.sprite(x, y, this.config.assets['ui_' + bar + '_left'].key, this.config.assets['ui_' + bar + '_left'].frame);
            this[bar].fg.left.setAlpha(this.config.hud[bar].alpha);
            this.hud.add(this[bar].fg.left);

            x += this[bar].fg.left.width;
            this[bar].fg.mid = this.scene.add.sprite(x, y, this.config.assets['ui_' + bar + '_mid'].key, this.config.assets['ui_' + bar + '_mid'].frame);
            this[bar].fg.mid.width = bar === 'health_bar' ? this.mission.getPlayer().getChasisHealth() : this.mission.getPlayer().getChasisEnergy();
            this[bar].fg.mid.setAlpha(this.config.hud[bar].alpha);
            this.hud.add(this[bar].fg.mid);

            x += this[bar].fg.mid.width;
            this[bar].fg.right = this.scene.add.sprite(x, y, this.config.assets['ui_' + bar + '_right'].key, this.config.assets['ui_' + bar + '_right'].frame);
            this[bar].fg.right.setAlpha(this.config.hud[bar].alpha);
            this.hud.add(this[bar].fg.right);
        });
    }

    update () {
        ['health_bar', 'energy_bar'].forEach(bar => {
            var amount = bar === 'health_bar' ? this.mission.getPlayer().getHealth() : this.mission.getPlayer().getEnergy();
            if (amount <= 0) { // hide bar if empty
                this[bar].fg.left.visible = false;
                this[bar].fg.mid.visible = false;
                this[bar].fg.right.visible = false;
            } else {
                this[bar].fg.left.visible = true;
                this[bar].fg.mid.visible = true;
                this[bar].fg.right.visible = true;

                this[bar].fg.mid.width = amount;

                var x = this[bar].fg.left.x + this[bar].fg.left.width + this[bar].fg.mid.width;
                var y = this.config.hud[bar].y;
                this[bar].fg.right.setPosition(x, y);
            }
        });
    }
};
