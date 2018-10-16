import 'pixi';
import 'p2';
import Phaser from 'phaser-ce';

import {Sound} from '../helpers/sound';
import {Snake} from '../prefabs/Snake';
import {Treat} from '../prefabs/Treat';
import { ApiHandler } from '../api/ApiHandler';

export class Game extends Phaser.State {
  private players: Snake[];
  private Snake: Snake;
  private spaceKey: Phaser.Key;
  private tick: number;
  private loopTick = 1000;
  private actions = ['attack', 'heal', 'collect', 'right', 'left', 'up', 'down'];
  private h: ApiHandler;

  private grid: Phaser.Graphics;

  private cellSize = 32;
  private cellX: number;
  private cellY: number;
  private treats: Treat[];
  private expectedTreatCount = 50;

  public create(): void {
    // Testing ApiHandler
    //this.h = new ApiHandler();
    //this.h.AddScripts();
    //this.h.GetAllScripts();
    // ------------------

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.createGrid();
    this.grid = this.game.add.graphics(0, 0);
    this.players = [];
    this.treats = [];

    this.cellX = this.game.width / this.cellSize;
    this.cellY = this.game.height / this.cellSize;

    // TODO: figure out how big a snake is supposed be, for now make it tuneable
    // TODO: add collision detection for snakes, world boundary, fruits
    for (let i = 0; i < 3; i++) {
      let snake = this.newSnake(`snake-${i}`);
      this.players.push(snake);
      this.game.add.existing(snake);
      snake.draw(this.grid)
    }

    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(() => {
      Sound.play();
    }, this);
    this.tick = this.game.time.now;
  }

  isCellAvailable(x, y): boolean {
    for (let i = 0; i < this.players.length; i++) {
      let snake = this.players[i];
      if (snake.position.x == x && snake.position.y == y) {
        return false;
      }
    }

    // Draw the treats
    for (let i = 0; i < this.treats.length; i++) {
      let treat = this.treats[i];
      if (treat.position.x == x && treat.position.y == y) {
        return false;
      }
    }

    return true;
  }

  getRandomInt(max): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  spawnTreat() {
    // TODO: check if spawn point is already taken
    let x = this.getRandomInt(this.cellX);
    let y = this.getRandomInt(this.cellY);
    while (!this.isCellAvailable(x, y)) {
      x = this.getRandomInt(this.cellX);
      y = this.getRandomInt(this.cellY);
      // TODO: give up after trying x times
    }
    this.treats.push(new Treat(Phaser.Color.GREEN, this.game, x, y, this.cellSize))
  }

  newSnake(id: string): Snake {
    let x = this.getRandomInt(this.cellX);
    let y = this.getRandomInt(this.cellY);
    // TODO: check if spawn point is already taken by another user
    let s = new Snake(id, this.game, x, y, this.cellSize);
    return s;
  }

  collect(snake: Snake): Phaser.Point {
    for (let i = 0; i < this.treats.length; i++) {
      let treat = this.treats[i];
      let treatRect = new Phaser.Rectangle(
        treat.position.x * this.cellX,
        treat.position.y * this.cellY,
        this.cellSize, this.cellSize
      )
      if (snake.position.x === treat.position.x &&
        snake.position.y === treat.position.y) {
        this.treats.splice(i, 1);
        return treat.position;
      }
    }
    return new Phaser.Point(-1, -1);
  }

  public update(): void {
    this.game.input.update();
    let tock = this.game.time.now - this.tick;
    // Limit the run loop to every x
    if (tock < this.loopTick) { return; }
    this.tick = this.game.time.now;

    this.grid.clear();
    // Make sure we have enough treats on screen
    for (;this.treats.length < this.expectedTreatCount;) {
      this.spawnTreat()
    }

    // Draw the treats
    for (let i = 0; i < this.treats.length; i++) {
      let treat = this.treats[i];
      treat.draw(this.grid);
    }

    // Draw the players
    for (let i = 0; i < this.players.length; i++) {
      let snake = this.players[i];
      let index = Math.floor((Math.random() * this.actions.length) | 0);
      let action = this.actions[index];

      switch (action) {
      case 'attack':
        // TODO: implement this
        break;
      case 'collect':
        let pos = this.collect(snake);
        if (pos.x !== -1) { snake.addBody(pos) }
        break;
      default:
        snake.move(action);
      }
      snake.draw(this.grid);
    }
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
        // graphics.drawRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
        // let t = `[${i * this.cellSize}x${j * this.cellSize}]`
        // this.game.add.text(i * this.cellSize, j * this.cellSize, t, style);
      }
    }
  }
}
