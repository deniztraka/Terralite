(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

class BootState {

  preload() {
    this.load.image('preload', 'img/preload.png')
  }

  create() {
    this.input.maxPointers = 1
    this.state.start('Preload')
  }

  update() { }
  render() { }
}

module.exports = BootState

},{}],2:[function(require,module,exports){
class GameState {
  constructor() {

  }
  preload() {}

  create() {
    this.stage.backgroundColor = '#2d2d2d';    
    
    this.createEmptyMap();
  }

  update() {}
  render() {}

  createEmptyMap(){
    this.map = this.game.add.tilemap(this.game);
    this.map.addTilesetImage('tiles');
    var backgroundLayer = this.map.create('floor',20,20,16,16);
    backgroundLayer.scrollFactorX = 0.5;
    backgroundLayer.scrollFactorY = 0.5;
    backgroundLayer.resizeWorld();
    this.map.enableTileMarker();

    this.map.fill(0, 0, 0, 20, 20);
  }
}

module.exports = GameState
},{}],3:[function(require,module,exports){

class MenuState {

  preload() { }

  create() {
    let logo = this.add.image(
      this.world.centerX, 
      this.world.centerY, 
      'logo')
    
    logo.anchor.set(.5)

    this.input.onTap.addOnce((pointer) => {
      this.state.start('Game')
    })
  }

  update() { }
  render() { }
}

module.exports = MenuState

},{}],4:[function(require,module,exports){

class PreloadState {

  preload() {
    this.preloadBar = this.game.add.sprite(
      this.world.centerX, 
      this.world.centerY, 
      'preload');
    
    this.preloadBar.anchor.set(.5);

    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('logo', 'img/logo.png');
    this.load.image('pnlogo', 'img/pnlogo.png');
    this.load.image('tiles','img/tiles/tiles.png');

  }

  create() {
    this.state.start('MainMenu')
  }

  update() { }
  render() { }
}

module.exports = PreloadState

},{}],5:[function(require,module,exports){
const TGameObjectFactory     = require('./TGameObjectFactory');
class TGame extends Phaser.Game {
    boot(){        
        super.boot();
        this.add =  new TGameObjectFactory(this);
    }
}

module.exports = TGame;
},{"./TGameObjectFactory":6}],6:[function(require,module,exports){
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
},{"./TTileMap":8}],7:[function(require,module,exports){
class TTile extends Phaser.Tile {
    constructor(layer, index, x, y, width, height, type){
        super(layer, index, x, y, width, height)
        this.type = type;
    }
}

module.exports = TTile; 
},{}],8:[function(require,module,exports){
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
},{"./TTile":7,"./TileMarker":9}],9:[function(require,module,exports){
class TileMarker extends Phaser.Graphics {
    constructor(game, x, y) {
        super(game, x, y);
        this.lineStyle(2, 0x000000, 1);
        this.drawRect(0, 0, 16, 16);  
        game.add.existing(this);      
    }    
}

module.exports = TileMarker;
},{}],10:[function(require,module,exports){
// PHASER IS IMPORTED AS AN EXTERNAL BUNDLE IN INDEX.HTML

Phaser.Device.whenReady(() => {
  const bootState     = require('./BootState')
  const preloadState  = require('./PreloadState')
  const menuState     = require('./MenuState')
  const gameState     = require('./GameState')
  const TGame     = require('./core/TGame')
debugger;
  const game = new TGame(800, 600, Phaser.AUTO, 'game');

  game.stage.backgroundColor = 0x000000;

  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

  game.scale.setMinMax(800, 600);

  game.scale.pageAlignVertically = true;
  game.scale.pageAlignHorizontally = true;

  game.state.add('Boot',      bootState);
  game.state.add('Preload',   preloadState);
  game.state.add('MainMenu',  menuState);
  game.state.add('Game',      gameState);

  game.state.start('Boot');
})

},{"./BootState":1,"./GameState":2,"./MenuState":3,"./PreloadState":4,"./core/TGame":5}]},{},[10])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1VzZXJzL2QudHJha2EvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvcGhhc2VyLW5vZGUta2l0L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9qcy9Cb290U3RhdGUuanMiLCJidWlsZC9qcy9HYW1lU3RhdGUuanMiLCJidWlsZC9qcy9NZW51U3RhdGUuanMiLCJidWlsZC9qcy9QcmVsb2FkU3RhdGUuanMiLCJidWlsZC9qcy9jb3JlL1RHYW1lLmpzIiwiYnVpbGQvanMvY29yZS9UR2FtZU9iamVjdEZhY3RvcnkuanMiLCJidWlsZC9qcy9jb3JlL1RUaWxlLmpzIiwiYnVpbGQvanMvY29yZS9UVGlsZU1hcC5qcyIsImJ1aWxkL2pzL2NvcmUvVGlsZU1hcmtlci5qcyIsImJ1aWxkL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcclxuY2xhc3MgQm9vdFN0YXRlIHtcclxuXHJcbiAgcHJlbG9hZCgpIHtcclxuICAgIHRoaXMubG9hZC5pbWFnZSgncHJlbG9hZCcsICdpbWcvcHJlbG9hZC5wbmcnKVxyXG4gIH1cclxuXHJcbiAgY3JlYXRlKCkge1xyXG4gICAgdGhpcy5pbnB1dC5tYXhQb2ludGVycyA9IDFcclxuICAgIHRoaXMuc3RhdGUuc3RhcnQoJ1ByZWxvYWQnKVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkgeyB9XHJcbiAgcmVuZGVyKCkgeyB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQm9vdFN0YXRlXHJcbiIsImNsYXNzIEdhbWVTdGF0ZSB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gIH1cclxuICBwcmVsb2FkKCkge31cclxuXHJcbiAgY3JlYXRlKCkge1xyXG4gICAgdGhpcy5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAnIzJkMmQyZCc7ICAgIFxyXG4gICAgXHJcbiAgICB0aGlzLmNyZWF0ZUVtcHR5TWFwKCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7fVxyXG4gIHJlbmRlcigpIHt9XHJcblxyXG4gIGNyZWF0ZUVtcHR5TWFwKCl7XHJcbiAgICB0aGlzLm1hcCA9IHRoaXMuZ2FtZS5hZGQudGlsZW1hcCh0aGlzLmdhbWUpO1xyXG4gICAgdGhpcy5tYXAuYWRkVGlsZXNldEltYWdlKCd0aWxlcycpO1xyXG4gICAgdmFyIGJhY2tncm91bmRMYXllciA9IHRoaXMubWFwLmNyZWF0ZSgnZmxvb3InLDIwLDIwLDE2LDE2KTtcclxuICAgIGJhY2tncm91bmRMYXllci5zY3JvbGxGYWN0b3JYID0gMC41O1xyXG4gICAgYmFja2dyb3VuZExheWVyLnNjcm9sbEZhY3RvclkgPSAwLjU7XHJcbiAgICBiYWNrZ3JvdW5kTGF5ZXIucmVzaXplV29ybGQoKTtcclxuICAgIHRoaXMubWFwLmVuYWJsZVRpbGVNYXJrZXIoKTtcclxuXHJcbiAgICB0aGlzLm1hcC5maWxsKDAsIDAsIDAsIDIwLCAyMCk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTdGF0ZSIsIlxyXG5jbGFzcyBNZW51U3RhdGUge1xyXG5cclxuICBwcmVsb2FkKCkgeyB9XHJcblxyXG4gIGNyZWF0ZSgpIHtcclxuICAgIGxldCBsb2dvID0gdGhpcy5hZGQuaW1hZ2UoXHJcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWCwgXHJcbiAgICAgIHRoaXMud29ybGQuY2VudGVyWSwgXHJcbiAgICAgICdsb2dvJylcclxuICAgIFxyXG4gICAgbG9nby5hbmNob3Iuc2V0KC41KVxyXG5cclxuICAgIHRoaXMuaW5wdXQub25UYXAuYWRkT25jZSgocG9pbnRlcikgPT4ge1xyXG4gICAgICB0aGlzLnN0YXRlLnN0YXJ0KCdHYW1lJylcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7IH1cclxuICByZW5kZXIoKSB7IH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZW51U3RhdGVcclxuIiwiXHJcbmNsYXNzIFByZWxvYWRTdGF0ZSB7XHJcblxyXG4gIHByZWxvYWQoKSB7XHJcbiAgICB0aGlzLnByZWxvYWRCYXIgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZShcclxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJYLCBcclxuICAgICAgdGhpcy53b3JsZC5jZW50ZXJZLCBcclxuICAgICAgJ3ByZWxvYWQnKTtcclxuICAgIFxyXG4gICAgdGhpcy5wcmVsb2FkQmFyLmFuY2hvci5zZXQoLjUpO1xyXG5cclxuICAgIHRoaXMubG9hZC5zZXRQcmVsb2FkU3ByaXRlKHRoaXMucHJlbG9hZEJhcik7XHJcblxyXG4gICAgdGhpcy5sb2FkLmltYWdlKCdsb2dvJywgJ2ltZy9sb2dvLnBuZycpO1xyXG4gICAgdGhpcy5sb2FkLmltYWdlKCdwbmxvZ28nLCAnaW1nL3BubG9nby5wbmcnKTtcclxuICAgIHRoaXMubG9hZC5pbWFnZSgndGlsZXMnLCdpbWcvdGlsZXMvdGlsZXMucG5nJyk7XHJcblxyXG4gIH1cclxuXHJcbiAgY3JlYXRlKCkge1xyXG4gICAgdGhpcy5zdGF0ZS5zdGFydCgnTWFpbk1lbnUnKVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlKCkgeyB9XHJcbiAgcmVuZGVyKCkgeyB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZFN0YXRlXHJcbiIsImNvbnN0IFRHYW1lT2JqZWN0RmFjdG9yeSAgICAgPSByZXF1aXJlKCcuL1RHYW1lT2JqZWN0RmFjdG9yeScpO1xyXG5jbGFzcyBUR2FtZSBleHRlbmRzIFBoYXNlci5HYW1lIHtcclxuICAgIGJvb3QoKXsgICAgICAgIFxyXG4gICAgICAgIHN1cGVyLmJvb3QoKTtcclxuICAgICAgICB0aGlzLmFkZCA9ICBuZXcgVEdhbWVPYmplY3RGYWN0b3J5KHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRHYW1lOyIsImNvbnN0IFRUaWxlTWFwICAgICA9IHJlcXVpcmUoJy4vVFRpbGVNYXAnKTtcclxuY2xhc3MgVEdhbWVPYmplY3RGYWN0b3J5IGV4dGVuZHMgUGhhc2VyLkdhbWVPYmplY3RGYWN0b3J5IHtcclxuICAgIC8qIGNvbnN0cnVjdG9yKGdhbWUsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCwgd2lkdGgsIGhlaWdodCl7XHJcbiAgICAgICAgc3VwZXIoZ2FtZSwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LCB3aWR0aCwgaGVpZ2h0KVxyXG4gICAgICAgIFxyXG4gICAgfSAqL1xyXG5cclxuICAgIHRpbGVtYXAoZ2FtZSwga2V5LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsIHdpZHRoLCBoZWlnaHQpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVFRpbGVNYXAoZ2FtZSwga2V5LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgfTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUR2FtZU9iamVjdEZhY3Rvcnk7ICIsImNsYXNzIFRUaWxlIGV4dGVuZHMgUGhhc2VyLlRpbGUge1xyXG4gICAgY29uc3RydWN0b3IobGF5ZXIsIGluZGV4LCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCB0eXBlKXtcclxuICAgICAgICBzdXBlcihsYXllciwgaW5kZXgsIHgsIHksIHdpZHRoLCBoZWlnaHQpXHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUVGlsZTsgIiwiY29uc3QgVGlsZU1hcmtlciA9IHJlcXVpcmUoJy4vVGlsZU1hcmtlcicpO1xyXG5jb25zdCBUVGlsZSA9IHJlcXVpcmUoJy4vVFRpbGUnKTtcclxuXHJcbmNsYXNzIFRUaWxlTWFwIGV4dGVuZHMgUGhhc2VyLlRpbGVtYXAge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZSwga2V5LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsIHdpZHRoLCBoZWlnaHQpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCBrZXksIHRpbGVXaWR0aCwgdGlsZUhlaWdodCwgd2lkdGgsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIHRoaXMubWFya2VyID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBfdXBkYXRlTWFya2VyKCkgeyAgICAgICAgXHJcbiAgICAgICAgdmFyIGN1cnJlbnRUaWxlID0gdGhpcy5nZXRUaWxlV29ybGRYWSh0aGlzLmdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFgsIHRoaXMuZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSwgMTYsIDE2KTtcclxuICAgICAgICBpZiAoY3VycmVudFRpbGUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm1hcmtlci54ID0gY3VycmVudFRpbGUueCAqIDE2O1xyXG4gICAgICAgICAgICB0aGlzLm1hcmtlci55ID0gY3VycmVudFRpbGUueSAqIDE2O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlbmFibGVUaWxlTWFya2VyKCkge1xyXG4gICAgICAgIHRoaXMubWFya2VyID0gbmV3IFRpbGVNYXJrZXIodGhpcy5nYW1lKTtcclxuICAgICAgICB0aGlzLmdhbWUuaW5wdXQuYWRkTW92ZUNhbGxiYWNrKHRoaXMuX3VwZGF0ZU1hcmtlciwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHV0VGlsZSh0aWxlLCB4LCB5LCBsYXllcikge1xyXG5cclxuICAgICAgICBpZiAodGlsZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVUaWxlKHgsIHksIGxheWVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxheWVyID0gdGhpcy5nZXRMYXllcihsYXllcik7XHJcblxyXG4gICAgICAgIGlmICh4ID49IDAgJiYgeCA8IHRoaXMubGF5ZXJzW2xheWVyXS53aWR0aCAmJiB5ID49IDAgJiYgeSA8IHRoaXMubGF5ZXJzW2xheWVyXS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRpbGUgaW5zdGFuY2VvZiBUVGlsZSkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aWxlLmluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhc1RpbGUoeCwgeSwgbGF5ZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXllcnNbbGF5ZXJdLmRhdGFbeV1beF0uY29weSh0aWxlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXllcnNbbGF5ZXJdLmRhdGFbeV1beF0gPSBuZXcgVFRpbGUobGF5ZXIsIGluZGV4LCB4LCB5LCB0aWxlLndpZHRoLCB0aWxlLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IHRpbGU7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFzVGlsZSh4LCB5LCBsYXllcikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxheWVyc1tsYXllcl0uZGF0YVt5XVt4XS5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxheWVyc1tsYXllcl0uZGF0YVt5XVt4XSA9IG5ldyBUVGlsZSh0aGlzLmxheWVyc1tsYXllcl0sIGluZGV4LCB4LCB5LCB0aGlzLnRpbGVXaWR0aCwgdGhpcy50aWxlSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29sbGlkZUluZGV4ZXMuaW5kZXhPZihpbmRleCkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXllcnNbbGF5ZXJdLmRhdGFbeV1beF0uc2V0Q29sbGlzaW9uKHRydWUsIHRydWUsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sYXllcnNbbGF5ZXJdLmRhdGFbeV1beF0ucmVzZXRDb2xsaXNpb24oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5sYXllcnNbbGF5ZXJdLmRpcnR5ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlRmFjZXMobGF5ZXIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGF5ZXJzW2xheWVyXS5kYXRhW3ldW3hdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUVGlsZU1hcDsiLCJjbGFzcyBUaWxlTWFya2VyIGV4dGVuZHMgUGhhc2VyLkdyYXBoaWNzIHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHkpIHtcclxuICAgICAgICBzdXBlcihnYW1lLCB4LCB5KTtcclxuICAgICAgICB0aGlzLmxpbmVTdHlsZSgyLCAweDAwMDAwMCwgMSk7XHJcbiAgICAgICAgdGhpcy5kcmF3UmVjdCgwLCAwLCAxNiwgMTYpOyAgXHJcbiAgICAgICAgZ2FtZS5hZGQuZXhpc3RpbmcodGhpcyk7ICAgICAgXHJcbiAgICB9ICAgIFxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRpbGVNYXJrZXI7IiwiLy8gUEhBU0VSIElTIElNUE9SVEVEIEFTIEFOIEVYVEVSTkFMIEJVTkRMRSBJTiBJTkRFWC5IVE1MXHJcblxyXG5QaGFzZXIuRGV2aWNlLndoZW5SZWFkeSgoKSA9PiB7XHJcbiAgY29uc3QgYm9vdFN0YXRlICAgICA9IHJlcXVpcmUoJy4vQm9vdFN0YXRlJylcclxuICBjb25zdCBwcmVsb2FkU3RhdGUgID0gcmVxdWlyZSgnLi9QcmVsb2FkU3RhdGUnKVxyXG4gIGNvbnN0IG1lbnVTdGF0ZSAgICAgPSByZXF1aXJlKCcuL01lbnVTdGF0ZScpXHJcbiAgY29uc3QgZ2FtZVN0YXRlICAgICA9IHJlcXVpcmUoJy4vR2FtZVN0YXRlJylcclxuICBjb25zdCBUR2FtZSAgICAgPSByZXF1aXJlKCcuL2NvcmUvVEdhbWUnKVxyXG5kZWJ1Z2dlcjtcclxuICBjb25zdCBnYW1lID0gbmV3IFRHYW1lKDgwMCwgNjAwLCBQaGFzZXIuQVVUTywgJ2dhbWUnKTtcclxuXHJcbiAgZ2FtZS5zdGFnZS5iYWNrZ3JvdW5kQ29sb3IgPSAweDAwMDAwMDtcclxuXHJcbiAgZ2FtZS5zY2FsZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xyXG4gIGdhbWUuc2NhbGUuZnVsbFNjcmVlblNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XHJcblxyXG4gIGdhbWUuc2NhbGUuc2V0TWluTWF4KDgwMCwgNjAwKTtcclxuXHJcbiAgZ2FtZS5zY2FsZS5wYWdlQWxpZ25WZXJ0aWNhbGx5ID0gdHJ1ZTtcclxuICBnYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XHJcblxyXG4gIGdhbWUuc3RhdGUuYWRkKCdCb290JywgICAgICBib290U3RhdGUpO1xyXG4gIGdhbWUuc3RhdGUuYWRkKCdQcmVsb2FkJywgICBwcmVsb2FkU3RhdGUpO1xyXG4gIGdhbWUuc3RhdGUuYWRkKCdNYWluTWVudScsICBtZW51U3RhdGUpO1xyXG4gIGdhbWUuc3RhdGUuYWRkKCdHYW1lJywgICAgICBnYW1lU3RhdGUpO1xyXG5cclxuICBnYW1lLnN0YXRlLnN0YXJ0KCdCb290Jyk7XHJcbn0pXHJcbiJdfQ==
