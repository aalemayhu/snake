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
  private text: Phaser.BitmapText;
  private spaceKey: Phaser.Key;
  private tick: number;
  private loopTick = 1000;
  private actions = ['attack', 'heal', 'collect', 'right', 'left', 'up', 'down'];

  public create(): void {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.text = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 100, 'font', 'Press Arrows / Space', 15);
    this.text.x = this.text.x - ~~(this.text.width * 0.5);

    // TODO: movement as grid units
    // TODO: figure out how big a snake is supposed be, for now make it tuneable
    // TODO: add collision detection for snakes, world boundary, fruits
    this.players = [];
    for (let i = 0; i < 3; i++) {
      let snake = this.newSnake(`snake-${i}`);
      this.players.push(snake);
      this.game.add.existing(snake);
    }

    this.grid = [];
    this.grid.push(new Phaser.Line(0, 0, this.game.width * 0.8, 0));
    this.grid.push(new Phaser.Line(0, 0, 0, this.game.height * 0.8));
    this.grid.push(new Phaser.Line(0, this.game.height * 0.8, this.game.width * 0.8, this.game.height * 0.8));
    this.grid.push(new Phaser.Line(this.game.width * 0.8, 0, this.game.width * 0.8, this.game.height * 0.8));


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
    let x = this.getRandomInt(this.game.world.centerX);
    let y = this.getRandomInt(this.game.world.centerY);
    // TODO: check if spawn point is already taken by another user
    let s = new Snake(id, this.game, x, y);
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
      this.text.setText(`${snake.id} - ${action}`);
      snake.run(action);
    }
  }

  render() {
    for (let i = 0; i < this.grid.length; i++) {
      this.game.debug.geom(this.grid[i]);
    }
  }
}
