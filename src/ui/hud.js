const BAR_SPACING = 35;
const START_Y = 20;

export default class HUD {
    constructor (scene, mission) {
        this.scene = scene;
        this.mission = mission;

        // config data
        this.config = {};
        this.config.assets = this.scene.cache.json.get('assetsConfig');
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
        ['health_bar', 'energy_bar'].forEach((bar, index) => {
            //  bar
            this[bar] = {};

            // health bar background
            this[bar].bg = {};

            let x = this.scene.sys.game.config.width / 2; // center of screen
            let y = BAR_SPACING * index + START_Y; // near the top but spaced based on which bar it is

            let barAmount = bar === 'health_bar' ? this.mission.getPlayer().getChasisHealth() : this.mission.getPlayer().getChasisEnergy();

            this[bar].bg.mid = this.scene.add.sprite(x, y, this.config.assets.ui_bar_bg_mid.key, this.config.assets.ui_bar_bg_mid.frame);
            this[bar].bg.mid.setDisplaySize(barAmount * 2, this[bar].bg.mid.height);

            this[bar].bg.left = this.scene.add.sprite(x, y, this.config.assets.ui_bar_bg_left.key, this.config.assets.ui_bar_bg_left.frame);
            this[bar].bg.left.setOrigin(1, 0.5);
            this[bar].bg.left.setPosition(x - barAmount + this[bar].bg.left.displayWidth, y); // fix position after origin


            this[bar].bg.right = this.scene.add.sprite(x, y, this.config.assets.ui_bar_bg_right.key, this.config.assets.ui_bar_bg_right.frame);
            this[bar].bg.right.setOrigin(0, 0.5);
            this[bar].bg.right.setPosition(x + barAmount - this[bar].bg.right.displayWidth, y);

            // bar foreground
            this[bar].fg = {};

            this[bar].fg.mid = this.scene.add.sprite(x, y, this.config.assets['ui_' + bar + '_mid'].key, this.config.assets['ui_' + bar + '_mid'].frame);
            this[bar].fg.mid.setDisplaySize(barAmount * 2, this[bar].fg.mid.height);

            this[bar].fg.left = this.scene.add.sprite(x, y, this.config.assets['ui_' + bar + '_left'].key, this.config.assets['ui_' + bar + '_left'].frame);
            this[bar].fg.left.setOrigin(1, 0.5);
            this[bar].bg.left.setPosition(x - barAmount + this[bar].fg.left.displayWidth, y); // fix position after origin

            this[bar].fg.right = this.scene.add.sprite(x, y, this.config.assets['ui_' + bar + '_right'].key, this.config.assets['ui_' + bar + '_right'].frame);
            this[bar].fg.right.setOrigin(0, 0.5);
            this[bar].bg.right.setPosition(x + barAmount - this[bar].fg.right.displayWidth, y);
        });
    }

    update () {
        ['health_bar', 'energy_bar'].forEach(bar => {
            let barAmount = bar === 'health_bar' ? this.mission.getPlayer().getHealth() : this.mission.getPlayer().getEnergy();

            if (barAmount <= 0) { // hide bar if empty
                this[bar].fg.left.setVisible(false);
                this[bar].fg.mid.setVisible(false);
                this[bar].fg.right.setVisible(false);
            } else {
                this[bar].fg.left.setVisible(true);
                this[bar].fg.mid.setVisible(true);
                this[bar].fg.right.setVisible(true);

                // since origin is centered we double it
                this[bar].fg.mid.setDisplaySize(barAmount * 2, this[bar].fg.mid.displayHeight);

                // left cap x pos based on bar amount
                x = this[bar].fg.mid.x - barAmount + (barAmount > this[bar].fg.left.displayWidth ? this[bar].fg.left.displayWidth : 0);
                this[bar].fg.left.setPosition(x, this[bar].fg.right.y);

                // right cap x pos based on bar amount
                let x = this[bar].fg.mid.x + barAmount - (barAmount > this[bar].fg.right.displayWidth ? this[bar].fg.right.displayWidth : 0);
                this[bar].fg.right.setPosition(x, this[bar].fg.right.y);
            }
        });
    }
};
