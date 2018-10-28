import Phaser from 'phaser-ce';
import { ApiHandler } from '../api/ApiHandler';

export class Snake {
  public color: number;

  private snakeBody: Phaser.Point[];
  private cellSize: number;
  private cellX: number;
  private cellY: number;
  private avatarUrl: string;
  private head: Phaser.Sprite;
  private headLoaded: boolean = false;
  public username: string;
  private game: Phaser.Game;
  private bmd: Phaser.BitmapData;
  public score = 0;

  // The four cardinal directions
  private NORTH = new Phaser.Point(0, -1);
  private SOUTH = new Phaser.Point(0, 1);
  private EAST = new Phaser.Point(1, 0);
  private WEST = new Phaser.Point(-1, 0);
  private moveDirection: Phaser.Point;

  private headAngles = {
    'right': 90,
    'left': -90,
    // 'up': 180,
    // 'down': 0,
  }

  constructor(
    game: Phaser.Game,
    x: number,
    y: number,
    cellSize: number,
    user: string,
  ) {
    this.snakeBody = [];
    this.cellSize = cellSize;
    this.color = Phaser.Color.getRandomColor();
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
    ApiHandler.getAvatarData(this.avatarUrl, (data) => {
        this.game.load.image(`avatar-${this.username}`, data.logo);
        this.game.load.onLoadComplete.add(() => {
          this.head = this.game.make.sprite(0, 0, `avatar-${this.username}`);
          this.setupHead();
          }, this);
        this.game.load.start();
    })
  }

  setupHead() {
    const w = this.head.width;
    const h = this.head.height;

    this.head.scale.setTo(this.cellSize / w, this.cellSize / h);
    this.head.anchor.setTo(0.5, 0.5);
    this.headLoaded = true;
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
      if (!e.equals(this.getHeadPosition()) || !this.headLoaded) {
        graphics.drawRoundedRect(e.x * this.cellSize, e.y * this.cellSize,
          this.cellSize, this.cellSize, 6
        );
      }
    });
  }

  isValidMove(position: Phaser.Point): boolean {
    return this.snakeBody.find(s => position.equals(s)) === undefined;
  }

  performMoveIfPossible(direction) {
    const headPosition = this.getHeadPosition();
    const newPosition = new Phaser.Point(
      this.moveDirection.x + headPosition.x,
      this.moveDirection.y + headPosition.y
    );

    if (!this.isValidMove(newPosition)) { return; }

    if (newPosition.x >= this.cellX || newPosition.x < 0 ||
      newPosition.y >= this.cellY - 1 || newPosition.y < 0) {
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

  left(): Phaser.Point {
    switch(this.moveDirection) {
      case this.SOUTH: { return this.EAST; }
      case this.NORTH: { return this.WEST; }
      case this.EAST: { return this.NORTH; }
      case this.WEST: { return this.SOUTH; }
      default:
      return undefined;
    }
  }

  right(): Phaser.Point {
    switch(this.moveDirection) {
      case this.SOUTH: { return this.WEST; }
      case this.NORTH: { return this.EAST; }
      case this.EAST: { return this.SOUTH; }
      case this.WEST: { return this.NORTH; }
      default:
        return undefined;
    }
  }

  handle(direction) {
    switch (direction) {
    case 'right': {
      this.moveDirection = this.right();
      break;
    }
    case 'left': {
      this.moveDirection = this.left();
      break;
    }
    case 'forward': {
      // Nothing todo should move by default
      break;
    }
    }
  }

  public viewCoordinates(): Object {
    let h = this.getHeadPosition();
    let l = this.left();
    const r = this.right();
    return {
      'forward': new Phaser.Point(h.x + this.moveDirection.x, h.y + this.moveDirection.y),
      'right': new Phaser.Point(h.x + r.x, h.y + r.y),
      'left': new Phaser.Point(h.x + l.x, h.y + l.y),
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
    if (!this.getVisible()) {
      this.headLoaded = false;
      this.snakeBody.push(pos);
      this.fetchHead();
      this.head.alpha = 1;
    } else {
      this.snakeBody.push(pos);
    }
  }

  public removeBody(pos: Phaser.Point) {
    let index = this.snakeBody.findIndex(function (e) {
      return e.equals(pos);
    });
    if (index < 0) { return; }
    this.snakeBody.splice(index, 1);
    if (!this.getVisible()) {
      this.head.alpha = 0;
    }
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
