import Phaser from 'phaser-ce';

export class Snake extends Phaser.Graphics {
  readonly id: string;
  private cellSize: number;
  public color: number;

  private snakeBody: Phaser.Point[];
  private cellX: number;
  private cellY: number;

  // The four cardinal directions
  private NORTH = new Phaser.Point(0, 1);
  private SOUTH = new Phaser.Point(0, -1);
  private EAST = new Phaser.Point(1, 0);
  private WEST = new Phaser.Point(-1, 0);
  private moveDirection: Phaser.Point;
  private canTurn = true;

  constructor(id: string, game: Phaser.Game, x: number, y: number, cellSize: number) {
    super(game, x, y);
    this.snakeBody = [];
    this.id = id;
    this.cellSize = cellSize;
    this.color = 0xFF0000;
    this.snakeBody.push(new Phaser.Point(x, y))
    this.cellX = this.game.width / this.cellSize;
    this.cellY = this.game.height / this.cellSize;
    this.moveDirection = this.NORTH;
  }

  update() {
  }

  draw(graphics) {
    graphics.lineStyle(1, 0x0000FF, 1);
    graphics.beginFill(this.color);
    for (let i = 0; i < this.snakeBody.length; i++) {
      let position = this.snakeBody[i];
      graphics.drawRect(
        position.x * this.cellSize,
        position.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    }

    graphics.endFill()
    console.log(`${this.id}.drawRect(${this.position}, ${this.cellSize})`);
  }

  read(direction) {
    switch (direction) {
      case 'right': {
        if (this.moveDirection == this.NORTH || this.moveDirection == this.SOUTH) {
          this.moveDirection = this.EAST;
        }
        break;
      }
      case 'left': {
        if (this.moveDirection == this.NORTH || this.moveDirection == this.SOUTH) {
          this.moveDirection = this.WEST;
        }
        break;
      }
      case 'up': {
        if (this.moveDirection == this.EAST || this.moveDirection == this.WEST) {
          this.moveDirection = this.NORTH;
        }
        break;
      }
      case 'down': {
        if (this.moveDirection == this.EAST || this.moveDirection == this.WEST) {
          this.moveDirection = this.SOUTH;
        }
        break;
      }
    }
  }

  public addBody(pos: Phaser.Point) {
    this.snakeBody.push(pos);
  }

  public move(direction) {
    console.log(`move(${direction})`);
    this.read(direction);
    let headPosition = new Phaser.Point(
        this.snakeBody[this.snakeBody.length-1].x,
        this.snakeBody[this.snakeBody.length-1].y
    )
    let newPosition = new Phaser.Point(
      this.moveDirection.x + headPosition.x,
      this.moveDirection.y + headPosition.y
    );
    if (newPosition.x >= this.cellX || newPosition.x <= 0 ||
      newPosition.y >= this.cellY || newPosition.y <= 0) {
        console.log('New position is outside, aborting');
      } else if (this.snakeBody.length == 1) {
        this.snakeBody[0] = newPosition;
      } else {
        this.snakeBody.splice(0, 1);
        this.snakeBody.push(newPosition);
      }
    }
  }
