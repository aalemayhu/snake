import Phaser from 'phaser-ce';

export class Snake extends Phaser.Sprite {
  private direction: string;
  readonly id: string;

  constructor(id: string, game: Phaser.Game, x: number, y: number) {
    super(game, x, y, 'snake');

    this.id = id;
    this.anchor.setTo(0.5);
    this.game.physics.arcade.enableBody(this);
    this.checkWorldBounds = true;
    this.body.collideWorldBounds = true;
  }

  update() {
    switch (this.direction) {
      case 'right': {
        this.position.x++;
        break;
      }
      case 'left': {
        this.position.x--;
        break;
      }
      case 'up': {
        this.position.y--;
        break;
      }
      case 'down': {
        this.position.y++;
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
      this.direction = action;
      break;
    }
  }
}
}
