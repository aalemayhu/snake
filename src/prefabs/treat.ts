import Phaser from 'phaser-ce';

export class Treat extends Phaser.Graphics {
  private cellSize: number;
  public color: number;

  private cellX: number;
  private cellY: number;

  constructor(color: number, game: Phaser.Game, x: number, y: number, cellSize: number) {
    super(game, x, y);
    this.cellSize = cellSize;
    this.color = color;
    this.cellX = this.game.width / this.cellSize;
    this.cellY = this.game.height / this.cellSize;
  }

  draw(graphics) {
    graphics.beginFill(this.color);
    graphics.drawRect(
      this.position.x * this.cellSize,
      this.position.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    graphics.endFill();
  }
}
