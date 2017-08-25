class TTile extends Phaser.Tile {
    constructor(layer, index, x, y, width, height, type){
        super(layer, index, x, y, width, height)
        this.type = type;
    }
}

module.exports = TTile; 