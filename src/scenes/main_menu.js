export default class MainMenuScene extends Phaser.Scene {
    constructor (config, key = 'MainMenu') {
        super({ key: key });
    }

    init () {
        this.config = this.cache.json.get('mainMenuConfig');
        this.textSpacing = 0;
        this.textPaddingTop = 0; 
        this.textItemCount = this.config.items.length;

        var y = 0;
        this.config.items.forEach(item => {
            var text = this.add.text(0, y, item.label, this.config.style);

            if (!this.textSpacing)
                this.textSpacing = text.height;

            if (!this.textPaddingTop)
                this.textPaddingTop = (this.sys.game.config.height - this.textSpacing * this.textItemCount) / 2;

            let paddingLeft = (this.sys.game.config.width - text.width) / 2;

            text.setPadding(paddingLeft, this.textPaddingTop, 0, 0);

            if (item.nextScene) {
                text.setColor(this.config.link.color);
                let nextScene = item.nextScene;
                text.setInteractive();

                this.input.on('gameobjectdown', (ev, obj) => {
                    if (obj === text) {
                        this.input.stopPropagation();
                        this.scene.switch(nextScene);
                    }
                });
            } else {
                text.setColor(this.config.label.color);
            }

            y += this.textSpacing;
        });
    }
};
