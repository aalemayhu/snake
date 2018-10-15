import Phaser from 'phaser-ce';

export class Snake extends Phaser.Graphics {
  readonly id: string;
  private cellSize: number;
  public color: number;

  private snakeBody: Phaser.Point[];
  private cellX: number;
  private cellY: number;

  constructor(id: string, game: Phaser.Game, x: number, y: number, cellSize: number) {
    super(game, x, y);
    this.snakeBody = [];
    this.id = id;
    this.cellSize = cellSize;
    this.color = 0xFF0000;
    this.snakeBody.push(new Phaser.Point(x, y))
    this.cellX = this.game.width / this.cellSize;
    this.cellY = this.game.height / this.cellSize;
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

  nextPosition(direction): Phaser.Point {
    let newPosition = new Phaser.Point(0, 0);
    switch (direction) {
    case 'right': {
      if (this.position.x + 1 < this.cellX) { newPosition.x++; }
      break;
    }
    case 'left': {
      if (this.position.x - 1 >= 1) { newPosition.x--; }
      break;
    }
    case 'up': {
      if (this.position.y + 1 < this.cellY) { newPosition.y++ }
      break;
    }
    case 'down': {
      if (this.position.y - 1 >= 1) { newPosition.y--; }
    }
    }
    return newPosition;
  }

  public addBody(pos: Phaser.Point) {
    this.snakeBody.push(pos);
  }

  public move(direction) {
    console.log(`move(${direction})`);
    let newPosition = this.nextPosition(direction);
    if (this.snakeBody.length == 1) {
      newPosition.x += this.snakeBody[0].x;
      newPosition.y += this.snakeBody[0].y;
      this.snakeBody[0] = newPosition;
    } else {
      for (let i = 0; i < this.snakeBody.length; i++) {
        this.snakeBody[i].x += newPosition.x;
        this.snakeBody[i].y += newPosition.y;
      }
    }
  }
}
