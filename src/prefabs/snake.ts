import Phaser from 'phaser-ce';

export class Snake extends Phaser.Graphics {
  readonly id: string;
  private cellSize: number;
  public color: number;

  private positions: number[][];

  constructor(id: string, game: Phaser.Game, x: number, y: number, cellSize: number) {
    super(game, x, y);

    this.positions = [];
    this.width = this.game.width;
    this.height = this.game.height;

    this.id = id;
    this.cellSize = cellSize;
    this.color = 0xFF0000;
    this.positions.push([x, y])
  }

  update() {
  }

  draw(graphics) {
    graphics.lineStyle(1, 0x0000FF, 1);
    graphics.beginFill(this.color);
    //   for (let i = 0; i < this.positions.length; i++) {
    //
    //   }

    graphics.drawRect(
      this.position.x * this.cellSize,
      this.position.y * this.cellSize, this.cellSize,
      this.cellSize
    );
      graphics.endFill()
      console.log(`${this.id}.drawRect(${this.position}, ${this.cellSize})`);
    }

    move(direction) {
      console.log(`move(${direction})`);
      switch (direction) {
        case 'right': {
          if (this.position.x + this.cellSize >= this.height) {
            return;
          }
          this.position.x += this.cellSize;
          break;
        }
        case 'left': {
          if (this.position.x - this.cellSize <= this.cellSize) {
            return;
          }
          this.position.x -= this.cellSize;
          break;
        }
        case 'up': {
          if (this.position.y + this.cellSize >= this.height) {
            return;
          }
          this.position.y += this.cellSize;
          break;
        }
        case 'down': {
          if (this.position.y - this.cellSize <= this.cellSize) {
            return;
          }
          this.position.y -= this.cellSize;
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
