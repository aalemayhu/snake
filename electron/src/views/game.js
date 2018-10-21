const { TwitchChat } = require('../twitch/twitch-chat.js');
const { ApiHandler } = require('../api/api_handler.js');
const { Snake } = require('../api/snake.js');

const Phaser = require('phaser');


const playerNames = [];

function isCellAvailable(x, y) {
  const playerMatch = this.players.find(function (p) {
    if (p.getVisible()) {
      let snakePosition = p.getHeadPosition();
      return snakePosition.x === x && snakePosition.y === y;
    }
  });
  if (playerMatch) { return false; }

  const treatMatch = this.treats.find(t => {
    return t.position.x === x && t.position.y === y;
  });
  if (treatMatch) { return false; }
  return true;
}

function getRandomPosition(game, cellX, cellY) {
  let x = game.rnd.integerInRange(0, cellX);
  let y = game.rnd.integerInRange(0, cellY);
  while (!isCellAvailable(x, y)) {
    x = game.rnd.integerInRange(0, cellX);
    y = game.rnd.integerInRange(0, cellY);
        // TODO: give up after trying x times
  }
  return new Phaser.Point(x, y);
}


class GameView {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.config = {
      type: Phaser.AUTO,
      width: this.width,
      height: this.height,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
        },
      },
      scene: {
        preload: this.preload,
        create: this.create,
      },
    };
    this.game = new Phaser.Game(this.config);
  }


  create() {
    this.twitch = new TwitchChat('nyasaki_bot', 'ccscanf', '');
    // Testing ApiHandler
    this.h = new ApiHandler();

    const addUserFunc = (users) => {
      if (users.length > 0) {
        const newPlayers = this.h.addScripts(users);
        console.log('newPlayers=', newPlayers);
        playerNames.push(...newPlayers);
        this.h.compileScripts();


        for (let i = 0; i < playerNames.length; i += 1) {
          // TODO: the API has to give us an id for the player.
          const pos = getRandomPosition();
          const snake = new Snake(`snake-${i}`, this.game, pos.x, pos.y, this.cellSize, playerNames[i]);
          this.players.push(snake);
          snake.draw(this.grid);
        }
        this.playerCountLabel.text = `Player count: ${playerNames.length}`;
      }
    };

    this.twitch.getUsers(addUserFunc);

    this.twitch.subscribeToUsers({
      addUsers: addUserFunc,
      users: () => playerNames,
    });
    // ------------------
    // TODO: fix below so game is not paused when the window is unfocused
    // this.game.stage.disableVisibilityChange = true;
    this.grid = this.add.graphics(0, 0);
    const style = {
      font: '16px Arial',
      fill: '#ff0044',
      wordWrap: false,
      wordWrapWidth: this.cellSize * 3,
      align: 'center',
      backgroundColor: '#ffff00',
    };

    this.playerCountLabel = this.add.text(0, 0, 'Player count: 0', style);
    this.cellX = (this.game.width / this.cellSize) - 1;
    this.cellY = (this.game.height / this.cellSize) - 1;
    this.tick = this.time.now;
    this.players = [];
    this.treats = [];

    if (this.isDebugMode) {
      this.debugMode();
    }
  }

  debugMode() {
    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(() => {
      Phaser.Sound.play();
    }, this);
    this.createGrid();
  }


  createGrid() {
    const graphics = this.game.add.graphics(0, 0);
    // const style = { font: '8px Arial',
    //   fill: '#ff0044',
    //   wordWrap: true,
    //   wordWrapWidth: this.cellSize,
    //   align: 'center',
    //   backgroundColor: '#ffff00' };
    // set a fill and line style
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(10, 0xffd900, 1);

    // set a fill and line style again
    graphics.lineStyle(10, 0xFF0000, 0.8);
    graphics.beginFill(0xFF700B, 1);

    // draw a rectangle
    graphics.lineStyle(2, 0x0000FF, 1);

    for (let i = 0; i < this.game.width / this.cellSize; i += 1) {
      for (let j = 0; j < this.game.height / this.cellSize; j += 1) {
        // graphics.drawRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
        // let t = `[${i * this.cellSize}x${j * this.cellSize}]`
        // this.game.add.text(i * this.cellSize, j * this.cellSize, t, style);
      }
    }
  }

  preload() {
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
  }
}

module.exports = { GameView };
