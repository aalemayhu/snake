const { GameView } = require('./views/game.js');

const gameView = new GameView(800, 800);

console.log('Game up using', gameView.config);
