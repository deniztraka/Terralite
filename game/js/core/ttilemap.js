const TileMarker = require('./TileMarker');
const TTile = require('./TTile');

class TTileMap extends Phaser.Tilemap {
    constructor(game, key, tileWidth, tileHeight, width, height) {
        super(game, key, tileWidth, tileHeight, width, height);

        this.marker = null;
    }

    _updateMarker() {        
        var currentTile = this.getTileWorldXY(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY, 16, 16);
        if (currentTile != null) {
            this.marker.x = currentTile.x * 16;
            this.marker.y = currentTile.y * 16;
        }
    }

    enableTileMarker() {
        this.marker = new TileMarker(this.game);
        this.game.input.addMoveCallback(this._updateMarker, this);
    }

    putTile(tile, x, y, layer) {

        if (tile === null) {
            return this.removeTile(x, y, layer);
        }

        layer = this.getLayer(layer);

        if (x >= 0 && x < this.layers[layer].width && y >= 0 && y < this.layers[layer].height) {
            var index;

            if (tile instanceof TTile) {
                index = tile.index;

                if (this.hasTile(x, y, layer)) {
                    this.layers[layer].data[y][x].copy(tile);
                } else {
                    this.layers[layer].data[y][x] = new TTile(layer, index, x, y, tile.width, tile.height);
                }
            } else {
                index = tile;

                if (this.hasTile(x, y, layer)) {
                    this.layers[layer].data[y][x].index = index;
                } else {
                    this.layers[layer].data[y][x] = new TTile(this.layers[layer], index, x, y, this.tileWidth, this.tileHeight);
                }
            }

            if (this.collideIndexes.indexOf(index) > -1) {
                this.layers[layer].data[y][x].setCollision(true, true, true, true);
            } else {
                this.layers[layer].data[y][x].resetCollision();
            }

            this.layers[layer].dirty = true;

            this.calculateFaces(layer);

            return this.layers[layer].data[y][x];
        }
        return null;
    }
}

module.exports = TTileMap;