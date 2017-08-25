const TGameObjectFactory     = require('./TGameObjectFactory');
class TGame extends Phaser.Game {
    boot(){        
        super.boot();
        this.add =  new TGameObjectFactory(this);
    }
}

module.exports = TGame;