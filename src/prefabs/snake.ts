import Phaser from 'phaser-ce';
import axios from 'axios';

export class Snake {
  public color: number;

  private snakeBody: Phaser.Point[];
  private cellSize: number;
  private cellX: number;
  private cellY: number;
  private avatarUrl: string;
  private head;
  private headLoaded: boolean = false;
  public username: string;
  private game: Phaser.Game;
  private bmd: Phaser.BitmapData;

  // The four cardinal directions
  private NORTH = new Phaser.Point(0, 1);
  private SOUTH = new Phaser.Point(0, -1);
  private EAST = new Phaser.Point(1, 0);
  private WEST = new Phaser.Point(-1, 0);
  private moveDirection: Phaser.Point;

  private headAngles = {
    'right': 90,
    'left': -90,
    'up': 180,
    'down': 0,
  }

  constructor(
    id: string,
    game: Phaser.Game,
    x: number,
    y: number,
    cellSize: number,
    user: string,
  ) {
    this.snakeBody = [];
    this.cellSize = cellSize;
    this.color = Phaser.Color.getRandomColor(40, 100);
    this.snakeBody.push(new Phaser.Point(x, y));
    this.cellX = game.width / this.cellSize;
    this.cellY = game.height / this.cellSize;
    this.moveDirection = this.NORTH;
    this.game = game;

    this.username = user;

    this.avatarUrl = 'https://api.twitch.tv/kraken/channels/' + user.toLowerCase();
    this.fetchHead();

    this.bmd = this.game.add.bitmapData(this.game.width, this.game.height);
    this.bmd.addToWorld();
    this.bmd.smoothed = false;
  }

  fetchHead() {
    // TODO: make the client_id configurable
    axios.get(this.avatarUrl + '?client_id=' + 'itet5zjq7dlg8ywx4v470rihamhmbr')
      .then(({ data }) => {
        this.game.load.image(`avatar-${this.username}`, data.logo);
        this.game.load.onLoadComplete.add(() => {
          this.head = this.game.make.sprite(0, 0, `avatar-${this.username}`);

          const w = this.head._frame.width;
          const h = this.head._frame.height;

          this.head.scale.setTo(this.cellSize / w, this.cellSize / h);
          this.head.anchor.setTo(0.5, 0.5);
          this.headLoaded = true;
        }, this);
        this.game.load.start();
      });
  }

  update() {
  }

  draw(graphics) {
    const halfCS = this.cellSize / 2;
    if (this.headLoaded) {
      const s = this.getHeadPosition();

      this.bmd.clear();
      this.bmd.draw(this.head, s.x * this.cellSize + halfCS, s.y * this.cellSize + halfCS);
    }

    graphics.lineStyle(5, this.color, 1);
    this.snakeBody.map(e => {
      graphics.drawRoundedRect(e.x * this.cellSize, e.y * this.cellSize,
        this.cellSize, this.cellSize, 6
      );
    });
  }

  isValidMove(position: Phaser.Point): boolean {
    let canMove = true;
    this.snakeBody.forEach(s => {
      if (position.equals(s)) {
        canMove = false;
      }
    })
    return canMove;
  }

  performMoveIfPossible(direction) {
    const headPosition = this.getHeadPosition();
    const newPosition = new Phaser.Point(
      this.moveDirection.x + headPosition.x,
      this.moveDirection.y + headPosition.y
    );

    if (!this.isValidMove(newPosition)) { return; }

    if (newPosition.x >= this.cellX || newPosition.x <= 0 ||
      newPosition.y >= this.cellY - 1 || newPosition.y <= 0) {
      // console.log('New position is outside, aborting');
    } else if (this.snakeBody.length === 1) {
      this.snakeBody[0] = newPosition;
    } else {
      this.snakeBody.splice(0, 1);
      this.snakeBody.push(newPosition);
    }

    if (this.headLoaded) {
      this.head.angle = this.headAngles[direction];
    }
  }

  handle(direction) {
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

  public views(): Object {
    let h = this.getHeadPosition();
    return {
      'up': new Phaser.Point(h.x + this.NORTH.x, h.y + this.NORTH.y),
      'right': new Phaser.Point(h.x + this.EAST.x, h.y + this.EAST.y),
      'left': new Phaser.Point(h.x + this.WEST.x, h.y + this.WEST.y),
      'down': new Phaser.Point(h.x + this.SOUTH.x, h.y + this.SOUTH.y),
    };
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
    this.handle(direction);
    this.performMoveIfPossible(direction);
  }

  public destroy() {
    this.bmd.destroy();
    this.head.destroy();
  }
}
