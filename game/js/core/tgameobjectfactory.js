const TTileMap     = require('./TTileMap');
class TGameObjectFactory extends Phaser.GameObjectFactory {
    /* constructor(game, tileWidth, tileHeight, width, height){
        super(game, tileWidth, tileHeight, width, height)
        
    } */

    tilemap(game, key, tileWidth, tileHeight, width, height){
        return new TTileMap(game, key, tileWidth, tileHeight, width, height);
    };
}

module.exports = TGameObjectFactory; 