import Phaser from 'phaser-ce';

export class Snake {
  readonly id: string;
  public color: number;

  private snakeBody: Phaser.Point[];
  private cellSize: number;
  private cellX: number;
  private cellY: number;

  // The four cardinal directions
  private NORTH = new Phaser.Point(0, 1);
  private SOUTH = new Phaser.Point(0, -1);
  private EAST = new Phaser.Point(1, 0);
  private WEST = new Phaser.Point(-1, 0);
  private moveDirection: Phaser.Point;

  constructor(id: string, game: Phaser.Game, x: number, y: number, cellSize: number) {
    this.snakeBody = [];
    this.id = id;
    this.cellSize = cellSize;
    this.color = Phaser.Color.getRandomColor(40, 100);
    this.snakeBody.push(new Phaser.Point(x, y));
    this.cellX = game.width / this.cellSize;
    this.cellY = game.height / this.cellSize;
    this.moveDirection = this.NORTH;
  }

  update() {
  }

  draw(graphics) {
    graphics.lineStyle(2, this.color, 1);
    this.snakeBody.map(e => {
      if (!e.equals(this.getHeadPosition())) {
        graphics.drawRoundedRect(e.x * this.cellSize, e.y * this.cellSize,
          this.cellSize, this.cellSize, 6
        );
      }
    })
    graphics.beginFill(this.color);
    let s = this.getHeadPosition();
    graphics.drawRoundedRect(s.x * this.cellSize, s.y * this.cellSize,
      this.cellSize, this.cellSize, 6
    );
    graphics.endFill();
  }

  read(direction) {
    switch (direction) {
    case 'right': {
      if (this.moveDirection === this.NORTH || this.moveDirection === this.SOUTH) {
        this.moveDirection = this.EAST;
      }
      break;
    }
    case 'left': {
      if (this.moveDirection === this.NORTH || this.moveDirection === this.SOUTH) {
        this.moveDirection = this.WEST;
      }
      break;
    }
    case 'up': {
      if (this.moveDirection === this.EAST || this.moveDirection === this.WEST) {
        this.moveDirection = this.NORTH;
      }
      break;
    }
    case 'down': {
      if (this.moveDirection === this.EAST || this.moveDirection === this.WEST) {
        this.moveDirection = this.SOUTH;
      }
      break;
    }
    }
  }

  public getHeadPosition(): Phaser.Point {
    return new Phaser.Point(
      this.snakeBody[this.snakeBody.length - 1].x,
      this.snakeBody[this.snakeBody.length - 1].y
    );
  }

  public getInFront(): Phaser.Point {
    let front = this.getHeadPosition();
    front.add(this.moveDirection.x, this.moveDirection.y);
    return front;
  }

  public getVisible(): boolean {
    return this.snakeBody.length > 0;
  }

  public addBody(pos: Phaser.Point) {
    this.snakeBody.push(pos);
  }

  public removeBody(pos: Phaser.Point) {
    let index = this.snakeBody.findIndex(function (e) {
      return e.equals(pos);
    });
    if (index < 0) { return; }
    this.snakeBody.splice(index, 1);
  }

  public getBody(): Phaser.Point[] {
    return this.snakeBody;
  }

  public move(direction) {
    this.read(direction);
    let headPosition = this.getHeadPosition();
    let newPosition = new Phaser.Point(
      this.moveDirection.x + headPosition.x,
      this.moveDirection.y + headPosition.y
    );
    if (newPosition.x >= this.cellX || newPosition.x <= 0 ||
      newPosition.y >= this.cellY || newPosition.y <= 0) {
      console.log('New position is outside, aborting');
    } else if (this.snakeBody.length === 1) {
      this.snakeBody[0] = newPosition;
    } else {
      this.snakeBody.splice(0, 1);
      this.snakeBody.push(newPosition);
    }
  }
}
