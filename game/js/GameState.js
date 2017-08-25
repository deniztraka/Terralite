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