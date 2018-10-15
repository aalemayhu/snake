import 'pixi';
import 'p2';
import Phaser from 'phaser-ce';

import {Config} from './config';
import {TwitchChat} from './twitch/TwitchChat';
import {Boot} from './states/boot';
import {Preload} from './states/preload';
import {Game} from './states/game';

class Template extends Phaser.Game {

    constructor() {
        super(Config.gameWidth, Config.gameHeight, Phaser.CANVAS, 'content', null);

        this.state.add('Boot', Boot, false);
        this.state.add('Preload', Preload, false);
        this.state.add('Game', Game, false);

        this.state.start('Boot');
        let twitch = new TwitchChat ('nyasaki_bot', 'ccscanf' , 'byqcq486mbcznovxrjmh6z3y25hign');
    }
}

window.onload = () => {
    new Template();
};
