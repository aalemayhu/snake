import Phaser from 'phaser-ce';

export class Snake extends Phaser.Graphics {
  readonly id: string;
  private cellSize: number;
  public color: number;

  private positions: number[][];
  private cellX: number;
  private cellY: number;

  constructor(id: string, game: Phaser.Game, x: number, y: number, cellSize: number) {
    super(game, x, y);
    this.positions = [];
    this.id = id;
    this.cellSize = cellSize;
    this.color = 0xFF0000;
    this.positions.push([x, y])
    this.cellX = this.game.width / this.cellSize;
    this.cellY = this.game.height / this.cellSize;
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
      this.position.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
      graphics.endFill()
      console.log(`${this.id}.drawRect(${this.position}, ${this.cellSize})`);
    }

    move(direction) {
      console.log(`move(${direction})`);
      switch (direction) {
        case 'right': {
          if (this.position.x + 1 >= this.cellX) {
            console.log('abort')
            return;
          }
          this.position.x++;
          break;
        }
        case 'left': {
          if (this.position.x - 1 <= 0) {
            console.log('abort')
            return;
          }
          this.position.x--;
          break;
        }
        case 'up': {
          if (this.position.y + 1 >= this.cellY) {
            console.log('abort')
            return;
          }
          this.position.y++;
          break;
        }
        case 'down': {
          if (this.position.y - 1 <= 0) {
            console.log('abort')
            return;
          }
          this.position.y--;
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
