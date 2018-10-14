import Phaser from 'phaser-ce';

export class Snake extends Phaser.Sprite {
  readonly id: string;
  private movementUnits: number;
  private color: number;

  constructor(id: string, game: Phaser.Game, x: number, y: number, cellSize: number) {
    super(game, x, y, 'snake');

    this.id = id;
    this.movementUnits = cellSize;
    this.color = 0xFF0000;
  }

  update() {
  }

  move(direction) {
    switch (direction) {
      case 'right': {
        this.position.x += this.movementUnits;
        break;
      }
      case 'left': {
        this.position.x -= this.movementUnits;
        break;
      }
      case 'up': {
        this.position.y += this.movementUnits;
        break;
      }
      case 'down': {
        this.position.y -= this.movementUnits;
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
