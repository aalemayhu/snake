import Phaser from 'phaser-ce';

export class Snake extends Phaser.Graphics {
  readonly id: string;
  private movementUnits: number;
  private color: number;
  private worldHeight: number;
  private worldWidth: number;

  constructor(id: string, game: Phaser.Game, x: number, y: number, cellSize: number) {
    super(game, x, y);

    this.worldWidth = this.game.width;
    this.worldHeight = this.game.height;

    this.id = id;
    this.movementUnits = cellSize;
    this.color = 0xFF0000;
    this.position.x = x;
    this.position.y = y;
  }

  update() {
  }

  move(direction) {
    console.log(`move(${direction})`);
    switch (direction) {
      case 'right': {
        if (this.position.x + this.movementUnits >= this.worldWidth) {
        return;
        }
        this.position.x += this.movementUnits;
        break;
      }
      case 'left': {
        if (this.position.x - this.movementUnits <= this.movementUnits) {
            return;
          }
        this.position.x -= this.movementUnits;
        break;
      }
      case 'up': {
        if (this.position.y + this.movementUnits >= this.worldHeight) {
            return;
          }
        this.position.y += this.movementUnits;
        break;
      }
      case 'down': {
        if (this.position.y - this.movementUnits <= this.movementUnits) {
            return;
          }
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
