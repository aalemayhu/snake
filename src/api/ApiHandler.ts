import * as ts from 'typescript';
import { decode } from 'utf8';

import { SnakeApi } from './SnakeApi';
import { Action } from './Action';
import { Player } from './Player';

const path = require('path');

export class ApiHandler {
    players: Player[] = [];
    scripts: SnakeApi.Snake [] = new Array();

    constructor() {
        console.log('Handler initialized');
    }

    addScripts(users: string[]): string[] {
        // TODO: Load all users in the chat, use default script for users who have not uploaded a script
        //
        users.forEach((u) => {
            if (u === 'ccscanf') {
                this.players.push(new Player('interesting.snk', u));
            } else {
                this.players.push(new Player('Example.snk', u));
            }
        });

        return users.map((u) => u);
    }

    compileScripts() {
        this.players.forEach(element => {
            console.log('compileScripts', element);
            if (element !== undefined) {
                console.log(element + ' loaded');
                const src = decode(require(`../Scripts/${element.script}`));
                const res: string = ts.transpile(src);
                const script: any = eval(res);
                this.scripts.push(script);
            }
        });
    }

    getNextAction(idx: number, views): Action[] {
        const sc = this.scripts[idx];
        const currentAction = sc.Next.call(sc, SnakeApi)(views);
        console.log('Result:', currentAction);

        return currentAction;
    }
}
