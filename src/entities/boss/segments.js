export default class BossSegments {
    constructor (boss) {
        this.boss = boss;

        this.scene = boss.scene;

        this.displayList = new Phaser.GameObjects.DisplayList(this.scene);

        this.scene.sys.game.events.on('postrender', renderer => {
            this.scene.cameras.render(renderer, this.displayList);
        });
    }


}