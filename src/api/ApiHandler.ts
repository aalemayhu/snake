import * as ts from 'typescript';
import { decode } from 'utf8';
import axios from 'axios';

import { SnakeApi } from './SnakeApi';
import { Action } from './Action';
import { Player } from './Player';
import { View } from './View';
import { Snake } from '../prefabs/snake';

const path = require('path');

export class ApiHandler {
    players: Player[] = [];
    scripts: SnakeApi.Snake [] = new Array();

    constructor() {
        console.log('Handler initialized');
    }

    addScripts(users: string[]): string[] {
        // TODO: Load all users in the chat, use default script for users who have not uploaded a script
        users.forEach((u) => {
            if (u === 'mobilpadde') {
                this.players.push(new Player('smarty-pants.snk', u));
            } else {
                this.players.push(new Player('interesting.snk', u));
            }
        });

        return users.map((u) => u);
    }

    compileScripts() {
        this.players.forEach(element => {
            console.log('compileScripts', element);
            if (element !== undefined) {
                console.log(`Loaded ${element.script} for ${element.username}`);
                axios.get(`/Scripts/${element.script}`)
                    .then(({ data }) => {
                        const src = decode(data);
                        const res: string = ts.transpile(src);
                        const script: any = eval(res);
                        this.scripts.push(script);
                    });
            }
        });
    }

    getNextAction(idx: number, snake: Snake, views: View[]): Action[] {
        const sc = this.scripts[idx];
        const currentAction = sc.Next.call(sc, snake, SnakeApi)(views);

        return currentAction;
    }
}
