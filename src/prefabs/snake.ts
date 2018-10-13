import Phaser from 'phaser-ce';

export class Snake extends Phaser.Sprite {
  readonly id: string;

  constructor(id: string, game: Phaser.Game, x: number, y: number) {
    super(game, x, y, 'snake');

    this.id = id;
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.body.collideWorldBounds = true;
    this.tint = Math.random() * 0xffffff;
  }

  update() {
  }

  move(direction) {
    switch (direction) {
      case 'right': {
        this.position.x += this.width;
        break;
      }
      case 'left': {
        this.position.x -= this.width;
        break;
      }
      case 'up': {
        this.position.y -= this.width;
        break;
      }
      case 'down': {
        this.position.y -= this.width;
        break;
      }
    }
  }

  run(action) {
    switch (action) {
      case 'attack': {
        // TODO: Attack
        break;
      }
      case 'collect': {
        // TODO: Collect
        break;
      }
      // Move
      default: {
      this.move(action);
      break;
    }
  }
}
}
