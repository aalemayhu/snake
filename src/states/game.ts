import 'pixi';
import 'p2';
import Phaser from 'phaser-ce';

import {Sound} from '../helpers/sound';
import {Snake} from '../prefabs/Snake';

export class Game extends Phaser.State {
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

    // TODO: Add more snakes
    this.Snake = new Snake('snake-1', this.game, this.game.world.centerX, this.game.world.centerY);
    this.game.add.existing(this.Snake);

    // this.cursors = this.game.input.keyboard.createCursorKeys();

    this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.spaceKey.onDown.add(() => {
      Sound.play();
      this.Snake.x = this.game.world.centerX;
      this.Snake.y = this.game.world.centerY;
    }, this);
    this.tick = this.game.time.now;
  }

  public update(): void {
    this.game.input.update();
    let tock = this.game.time.now - this.tick;
    // Limit the run loop to every x
    if (tock < this.loopTick) { return; }
    this.tick = this.game.time.now;

    // TODO: run actions on all players
    let index = Math.floor((Math.random() * this.actions.length) | 0);
    let action = this.actions[index];
    this.text.setText(action);
    this.Snake.run(action);
  }
}
