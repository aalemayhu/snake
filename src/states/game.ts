import 'pixi';
import 'p2';
import Phaser from 'phaser-ce';

import {Sound} from '../helpers/sound';
import {Snake} from '../prefabs/Snake';

export class Game extends Phaser.State {
    private Snake: Phaser.Sprite;
    private cursors: Phaser.CursorKeys;
    private text: Phaser.BitmapText;
    private spaceKey: Phaser.Key;

    public create(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.text = this.game.add.bitmapText(this.game.world.centerX, this.game.world.centerY + 100, 'font', 'Press Arrows / Space', 15);
        this.text.x = this.text.x - ~~(this.text.width * 0.5);

        this.Snake = new Snake(this.game, this.game.world.centerX, this.game.world.centerY);
        this.game.add.existing(this.Snake);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spaceKey.onDown.add(() => {
            Sound.play();
            this.Snake.x = this.game.world.centerX;
            this.Snake.y = this.game.world.centerY;
        }, this);
    }

    public update(): void {
        this.game.input.update();

        if (this.cursors.down.isDown) {
            this.Snake.position.y++;
        }
        if (this.cursors.up.isDown) {
            this.Snake.position.y--;
        }
        if (this.cursors.left.isDown) {
            this.Snake.position.x--;
        }
        if (this.cursors.right.isDown) {
            this.Snake.position.x++;
        }
    }
}