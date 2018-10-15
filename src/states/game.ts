import 'pixi';
import 'p2';
import Phaser from 'phaser-ce';

import {Sound} from '../helpers/sound';
import {Snake} from '../prefabs/Snake';

export class Game extends Phaser.State {
  private players: Snake[];
  private grid: Phaser.Line[];
  private Snake: Snake;
  // private cursors: Phaser.CursorKeys;
  private spaceKey: Phaser.Key;
  private tick: number;
  private loopTick = 1000;
  // 'attack', 'heal', 'collect',
  private actions = ['right', 'left', 'up', 'down'];

  private cellSize = 32;

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.createGrid();
    this.game.load.image('snake', 'assets/sprites/snake.png');

    // TODO: movement as grid units
    // TODO: figure out how big a snake is supposed be, for now make it tuneable
    // TODO: add collision detection for snakes, world boundary, fruits
    this.players = [];
    for (let i = 0; i < 3; i++) {
      let snake = this.newSnake(`snake-${i}`);
      this.players.push(snake);
      this.game.add.existing(snake);
      snake.draw()
    }

    // this.cursors = this.game.input.keyboard.createCursorKeys();

    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(() => {
      Sound.play();
      this.Snake.x = this.game.world.centerX;
      this.Snake.y = this.game.world.centerY;
    }, this);
    this.tick = this.game.time.now;
  }

  getRandomInt(max): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  newSnake(id: string): Snake {
    let cellX = this.getRandomInt(this.game.width / this.cellSize);
    let cellY = this.getRandomInt(this.game.height / this.cellSize);
    let x = cellX * this.cellSize;
    let y = cellY * this.cellSize;
    console.log(`cellX=${cellX},cellY=${cellY}`);
    // TODO: check if spawn point is already taken by another user
    let s = new Snake(id, this.game, x, y, this.cellSize);
    s.tint = Phaser.Color.WHITE;
    console.log(`${s.id}.position=${s.position}`);
    return s;
  }

  public update(): void {
    this.game.input.update();
    let tock = this.game.time.now - this.tick;
    // Limit the run loop to every x
    if (tock < this.loopTick) { return; }
    this.tick = this.game.time.now;

    for (let i = 0; i < this.players.length; i++) {
      let snake = this.players[i];
      let index = Math.floor((Math.random() * this.actions.length) | 0);
      let action = this.actions[index];
      // snake.run(action);
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
        graphics.drawRect(i * this.cellSize, j * this.cellSize, this.cellSize, this.cellSize);
        // let t = `[${i * this.cellSize}x${j * this.cellSize}]`
        // this.game.add.text(i * this.cellSize, j * this.cellSize, t, style);
      }
    }
  }
}
