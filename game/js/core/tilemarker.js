class TileMarker extends Phaser.Graphics {
    constructor(game, x, y) {
        super(game, x, y);
        this.lineStyle(2, 0x000000, 1);
        this.drawRect(0, 0, 16, 16);  
        game.add.existing(this);      
    }    
}

module.exports = TileMarker;