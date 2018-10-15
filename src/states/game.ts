import 'pixi';
import 'p2';
import Phaser from 'phaser-ce';

import {Sound} from '../helpers/sound';
import {Snake} from '../prefabs/Snake';

export class Game extends Phaser.State {
  private players: Snake[];
  private Snake: Snake;
  // private cursors: Phaser.CursorKeys;
  private spaceKey: Phaser.Key;
  private tick: number;
  private loopTick = 1000;
  // 'attack', 'heal', 'collect',
  private actions = ['right', 'left', 'up', 'down'];

  private grid: Phaser.Graphics;

  private cellSize = 32;
  private cellX: number;
  private cellY: number;
  private treats: number[][];
  private expectedTreatCount = 32;

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.createGrid();
    this.grid = this.game.add.graphics(0, 0);
    this.players = [];
    this.treats = [];

    this.cellX = this.game.width / this.cellSize;
    this.cellY = this.game.height / this.cellSize;

    // TODO: movement as grid units
    // TODO: figure out how big a snake is supposed be, for now make it tuneable
    // TODO: add collision detection for snakes, world boundary, fruits
    for (let i = 0; i < 3; i++) {
      let snake = this.newSnake(`snake-${i}`);
      this.players.push(snake);
      this.game.add.existing(snake);

      // Add debugging colors
      if (i === 0) { snake.color = Phaser.Color.RED; }
      if (i === 1) { snake.color = Phaser.Color.GREEN; }
      if (i === 2) { snake.color = Phaser.Color.AQUA; }

      snake.draw(this.grid)
    }

    // this.cursors = this.game.input.keyboard.createCursorKeys();

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
    if (this.treats.length == 0) { return true };
    for (let i = 0; i < this.treats.length; i++) {
    let treat = this.treats[i];
    if (treat[0] == x && treat[1] == y) {
      return false;
    }
  }

  return true;
}

getRandomInt(max): number {
  return Math.floor(Math.random() * Math.floor(max));
}

newTreat(): [number] {
  // TODO: check if spawn point is already taken
  let x = this.getRandomInt(this.cellX);
  let y = this.getRandomInt(this.cellY);
  while (!this.isCellAvailable(x, y)) {
    x = this.getRandomInt(this.cellX);
    y = this.getRandomInt(this.cellY);
    // TODO: give up after trying x times
  }
  return [x,y]
}

newSnake(id: string): Snake {
  let x = this.getRandomInt(this.cellX);
  let y = this.getRandomInt(this.cellY);
  // TODO: check if spawn point is already taken by another user
  let s = new Snake(id, this.game, x, y, this.cellSize);
  return s;
}

public update(): void {
  this.game.input.update();
  let tock = this.game.time.now - this.tick;
  // Limit the run loop to every x
  if (tock < this.loopTick) { return; }
  this.tick = this.game.time.now;

  this.grid.clear();
  // Draw the players
  for (let i = 0; i < this.players.length; i++) {
  let snake = this.players[i];
  let index = Math.floor((Math.random() * this.actions.length) | 0);
  let action = this.actions[index];
  snake.run(action);
  snake.draw(this.grid)
}

// Make sure we have enough treats on screen
for (;this.treats.length < this.expectedTreatCount;) {
this.treats.push(this.newTreat())
}
// Draw the treats
for (let i = 0; i < this.treats.length; i++) {
let treat = this.treats[i];
this.grid.lineStyle(1, 0x0000FF, 1);
this.grid.beginFill(Phaser.Color.GRAY);
this.grid.drawRect(treat[0] * this.cellX,
  treat[1] * this.cellY, this.cellSize, this.cellSize);
  this.grid.endFill();
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
