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
  private isDebugMode = true;

  public create(): void {
    // Testing ApiHandler
    // this.h = new ApiHandler();
    // this.h.AddScripts();
    // this.h.GetAllScripts();
    // ------------------
    this.game.stage.disableVisibilityChange = true;
    this.grid = this.game.add.graphics(0, 0);
    this.cellX = this.game.width / this.cellSize;
    this.cellY = this.game.height / this.cellSize;
    this.tick = this.game.time.now;
    this.players = [];
    this.treats = [];

    this.debugMode();
  }

  isCellAvailable(x, y): boolean {
    for (let i = 0; i < this.players.length; i++) {
      let snakePosition = this.players[i].getHeadPosition();
      if (snakePosition.x === x && snakePosition.y === y) {
        return false;
      }
    }

    // Draw the treats
    for (let i = 0; i < this.treats.length; i++) {
      let treat = this.treats[i];
      if (treat.position.x === x && treat.position.y === y) {
        return false;
      }
    }

    return true;
  }

  debugMode() {
    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(() => {
      Sound.play();
    }, this);
    this.createGrid();
    // For debugging add three snakes
    for (let i = 0; i < 3; i++) {
      let snake = this.newSnake(`snake-${i}`);
      this.players.push(snake);
      snake.draw(this.grid);
    }
  }

  getRandomPosition(): Phaser.Point {
    let x = this.game.rnd.integerInRange(0, this.cellX);
    let y = this.game.rnd.integerInRange(0, this.cellY);
    while (!this.isCellAvailable(x, y)) {
      x = this.game.rnd.integerInRange(0, this.cellX);
      y = this.game.rnd.integerInRange(0, this.cellY);
      // TODO: give up after trying x times
    }
    return new Phaser.Point(x, y);
  }

  spawnTreat() {
    let pos = this.getRandomPosition();
    let t = new Treat(
      Phaser.Color.GREEN, this.game, pos.x, pos.y, this.cellSize);
    this.treats.push(t);
  }

  newSnake(id: string): Snake {
    let pos = this.getRandomPosition();
    let s = new Snake(id, this.game, pos.x, pos.y, this.cellSize);
    return s;
  }

  collect(snake: Snake, position: Phaser.Point) {
    let index = this.treats.findIndex(function (e) {
      return e.position.equals(position);
    });
    if (index < 0) { return; }
    this.treats.splice(index, 1);
  }

  attack(snake: Snake, position: Phaser.Point) {
    // Perform sanity check
    if (snake.getHeadPosition().equals(position)) {
      console.log('aborting attack position is same as head');
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

    this.grid.clear();
    // Make sure we have enough treats on screen
    for ( ;this.treats.length < this.expectedTreatCount; ) {
      this.spawnTreat();
    }

    // Draw the treats
    for (let i = 0; i < this.treats.length; i++) {
      let treat = this.treats[i];
      treat.draw(this.grid);
    }

    // Draw the players
    for (let i = 0; i < this.players.length; i++) {
      let snake = this.players[i];

      // TODO: receive the action from the ApiHandler
      let index = this.game.rnd.integerInRange(0, this.actions.length - 1);
      let action = this.actions[index];
      this.handle(action, snake, this.getRandomPosition());
    }
  }

  handle(action, snake, position) {
    switch (action) {
    case 'attack':
      this.attack(snake, position);
      break;
    case 'collect':
      this.collect(snake, position);
      break;
    case 'heal':
      // TODO: implement this
      console.log('heal is not implemented yet');
      break;
    default:
      snake.move(action);
    }
    snake.draw(this.grid);
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
