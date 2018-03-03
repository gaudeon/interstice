export default class Boss extends Phaser.Physics.Arcade.Group  {
    constructor (sector, x, y) {
       super(sector.scene.physics.world, sector.scene); 

       this.sector = sector;
    }
}