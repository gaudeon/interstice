export default class MissionsScene extends Phaser.Scene {
    constructor (config, key = 'MissionsScene') {
        super({ key: key });
    }

    create () {
        this.config = this.cache.json.get('missionsConfig');
        this.textSpacing = 0;
        this.textPaddingTop = 0; 
        this.textItemCount = this.config.missions.length;

        var y = 0;
        this.config.missions.forEach(mission => {
            var text = this.add.text(0, y, mission, this.config.style);

            if (!this.textSpacing) {
                this.textSpacing = text.height * 2;
            }

            if (!this.textPaddingTop) {
                this.textPaddingTop = (this.sys.game.config.height - this.textSpacing * this.textItemCount) / 2;
            }

            let paddingLeft = (this.sys.game.config.width - text.width) / 2;

            text.setPadding(paddingLeft, this.textPaddingTop, 0, 0);

            text.setColor(this.config.link.color);
            text.setInteractive();

            this.input.on('gameobjectdown', (ev, obj) => {
                if (obj === text) {
                    this.input.stopPropagation();
                    this.scene.start('PlayMission', this.config[mission].label);
                }
            });

            y += this.textSpacing;
        });
    }
};
