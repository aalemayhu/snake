import 'pixi';
import 'p2';
import Phaser from 'phaser-ce';

import {Sound} from '../helpers/sound';
import {Snake} from '../prefabs/snake';
import {Treat} from '../prefabs/treat';
import { ApiHandler } from '../api/ApiHandler';
import {View} from '../api/View';
import { TwitchChat } from '../twitch/TwitchChat';

export class Game extends Phaser.State {
  private players: Snake[];
  private Snake: Snake;
  private spaceKey: Phaser.Key;
  private tick: number;
  private loopTick = 1000;
  private actions = ['forward', 'right', 'left'];
  private h: ApiHandler;

  private grid: Phaser.Graphics;
  private topPlayers: Phaser.Text[];
  private topTeams: Phaser.Text[];

  private cellSize = 128;
  private cellX: number;
  private cellY: number;
  private treats: Treat[];
  private expectedTreatCount = 13;
  private isDebugMode = true;

  private numPlayers: number = 0;
  private playerNames: string[] = [];
  private twitch: TwitchChat;
  private isPaused = false;
  private isReady = false;
  private config = {};

  readonly LEADERBOARD_PLAYER_COUNT = 3;

  public create(): void {
    ApiHandler.getConfig((data) => {
      this.setupGame(data);
    })
  }

  setupGame(config) {
    this.twitch = new TwitchChat (config.botName, config.channel, config.token);
    this.setupAPI(this.twitch);
    this.config = config;

    // ------------------
    this.game.stage.disableVisibilityChange = true;
    this.grid = this.game.add.graphics(0, 0);
    this.cellX = Math.floor((this.game.width / this.cellSize) - 1);
    this.cellY = Math.floor((this.game.height / this.cellSize) - 1);
    this.tick = this.game.time.now;
    this.players = [];
    this.treats = [];

    if (this.isDebugMode) {
      this.debugMode();
    }
    this.setupLeaderBoard();
    // Tell the game it can start updating stuff on screen
    this.isReady = true;
  }

  pressedPauseButton() {
    console.log('button pressed');
  }

  setupAPI(twitch: TwitchChat) {
    // Testing ApiHandler
    this.h = new ApiHandler();

    const addUserFunc = (users) => {
      if (users.length > 0) {
        const newPlayers = this.h.addScripts(users);
        this.playerNames.push(...newPlayers);
        this.numPlayers = this.playerNames.length;
        this.h.compileScripts();
        this.addPlayers(newPlayers);
      }
    };

    twitch.getUsers(addUserFunc);

    twitch.subscribeToUsers({
      addUsers: addUserFunc,
      users: () => this.playerNames,
    });
  }

  addPlayers(players) {
    this.isReady = false;
    for (let i = 0; i < this.numPlayers; i++) {
      let username = this.playerNames[i];
      if (this.players.find(p => p.username === username)) {
        // Skipping players in screen
        continue;
      }
      let snake = this.newSnake(username);
      this.players.push(snake);
    }
    this.isReady = true;
  }

  isCellAvailable(x, y): boolean {
    const location = new Phaser.Point(x, y);
    return !this.playerAt(location) && !this.treatAt(location);
  }

  debugMode() {
    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(() => {
      this.isPaused = !this.isPaused;
    }, this);
    // this.createGrid();
  }

  getRandomPosition(startX, startY, ceilingX, ceilingY): Phaser.Point {
    let x = this.game.rnd.integerInRange(startX, ceilingX);
    let y = this.game.rnd.integerInRange(startY, ceilingY);
    while (!this.isCellAvailable(x, y)) {
      x = this.game.rnd.integerInRange(startX, ceilingX);
      y = this.game.rnd.integerInRange(startY, ceilingX);
      // TODO: give up after trying x times
    }
    return new Phaser.Point(x, y);
  }

  spawnTreat() {
    let pos = this.getRandomPosition(2, 4, this.cellX, this.cellY);
    let t = new Treat(0x3cb043, this.game, pos.x, pos.y, this.cellSize);
    this.treats.push(t);
  }

  newSnake(aUrl: string): Snake {
    let pos = this.getRandomPosition(0, 3, this.cellX, 4);
    let s = new Snake(this.game, pos.x, pos.y, this.cellSize, aUrl);
    return s;
  }

  treatAt(position: Phaser.Point): boolean {
    return this.treats.find(function (e) {
      return e.position.equals(position);
    }) != undefined;
  }

  playerAt(position: Phaser.Point): boolean {
    let p = this.players.find(p => p.getVisible());
    if (!p) { return false; }
    return p.getHeadPosition().equals(position)
  }

  collect(snake: Snake) {
    snake.getBody().forEach(s => {
      let index = this.treats.findIndex(function (e) {
        return e.position.equals(s);
      });
      if (index >= 0) {
        this.treats.splice(index, 1);
        snake.addBody(s);
      }
    });
  }

  attack(snake: Snake, position: Phaser.Point) {
    if (snake.getBody().find(s2 => s2.equals(position))) {
      // console.log('aborting attack position is same as head');
      return;
    }
    // Find the snake which matches the position
    for (let i = 0; i < this.players.length; i++) {
      let otherSnake = this.players[i];
      // Find the body part
      let parts = otherSnake.getBody();
      for (let j = 0; j < parts.length; j++) {
        let other = parts[j];
        // Remove the attacked part
        if (other.equals(position)) {
          otherSnake.removeBody(position);
        }
      }
    }
  }

  public update(): void {
    this.game.input.update();
    let tock = this.game.time.now - this.tick;
    // Limit the run loop to every x
    if (tock < this.loopTick) { return; }
    this.tick = this.game.time.now;

    if (this.isPaused || !this.isReady) { return; }

    this.grid.clear();
    // Make sure we have enough treats on screen
    for ( ; this.treats.length < this.expectedTreatCount; ) {
      this.spawnTreat();
    }

    // Respawn dead players
    this.players.filter(e => { return !e.getVisible(); }).forEach(p => {
      p.addBody(this.getRandomPosition(0, 3, this.cellX, 4));
    });

    // Draw the treats
    this.treats.forEach(t => {
      t.draw(this.grid);
    });

    // Run actions for players and draw them
    for (let i = 0; i < this.players.length; i++) {
      const snake = this.players[i];
      // TODO: We need to batch up requests, instead of making single HTTP requests
      this.h.getNextAction(i, snake, this.views(snake), (action) => {
        if (snake.getVisible()) {
          if (action.direction !== 'invalid') {
            const front = snake.getInFront();
            this.handle(action, snake);
            this.collect(snake);
            this.attack(snake, front);
          }
          snake.draw(this.grid);
        }
      });
    }

    // TODO: reduce the overhead caused by sorting
    this.players = this.players
    .sort((a, b) => a.username < b.username ? 1 : -1)
    .sort((a, b) => a.getBody().length < b.getBody().length ? 1 : -1);

    for (let i = 0; i < this.LEADERBOARD_PLAYER_COUNT; i++) {
      if (i >= this.players.length) {
        this.topPlayers[i].text = '';
        continue;
      }
      let snake = this.players[i];
      let t = this.topPlayers[i];
      t.text = ` ${snake.username} - ${snake.getBody().length}`
      this.game.world.bringToTop(t);
    }
  }

  views(snake: Snake): View[] {
    let views = [];
    // Get the views
    let s = snake.views();
    this.actions.forEach(e => {
      let pos = s[e];
      if (this.treatAt(pos)) {
        views.push(new View(e, 'treat'));
      } else if (s[e].x >= this.cellX || s[e].y >= this.cellY - 1) {
        views.push(new View(e, 'wall'));
      } else {
        views.push(new View(e, 'empty'));
      }
    });
    return views;
  }

  handle(action, snake) {
    // Make sure we get the latest colour from the chat
    let color = this.twitch.colors[snake.username];
    if (color) { snake.color = +color.replace('#', '0x'); }
    snake.move(action.direction);
  }

  createGrid() {
    let graphics = this.game.add.graphics(0, 0);
    let style = { font: '8px Arial', fill: '#ff0044', wordWrap: true,
      wordWrapWidth: this.cellSize, align: 'center', backgroundColor: '#ffff00' };
    // set a fill and line style
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(10, 0xffd900, 1);

    // set a fill and line style again
    graphics.lineStyle(10, 0xFF0000, 0.8);
    graphics.beginFill(0xFF700B, 1);

    // draw a rectangle
    graphics.lineStyle(2, 0x0000FF, 1);

    for (let i = 0; i < this.game.width / this.cellSize; i++) {
      for (let j = 0; j < this.game.height / this.cellSize; j++) {
        graphics.drawRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
        // let t = `[${i * this.cellSize}x${j * this.cellSize}]`
        // this.game.add.text(i * this.cellSize, j * this.cellSize, t, style);
      }
    }
  }

  setupLeaderBoard() {
    // Initialize the top players array
    this.topPlayers = [];
    // private topTeams: Phaser.Text[];
    let style = { font: 'Arial Black', fill: 'white', align: 'center' };
    for (let i = 0; i < this.LEADERBOARD_PLAYER_COUNT; i += 1) {
      let text = this.game.add.text(this.cellSize / 4, i * this.cellSize, '', style);
      text.alpha = 0.5;
      text.fontSize = 100;
      this.topPlayers.push(text);
    }
  }
}
