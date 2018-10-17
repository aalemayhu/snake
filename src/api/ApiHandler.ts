import * as ts from 'typescript';
import { decode } from 'utf8';

import { SnakeApi } from './SnakeApi';
import { Action } from './Action';
import { Player } from './Player';

const path = require('path');

let players: Player[] = [];
let scripts: SnakeApi.Snake [] = new Array();

export class ApiHandler {
    constructor() {
        console.log('Handler initialized');
    }

    addScripts() {
        // TODO: Load all users in the chat, use default script for users who have not uploaded a script
        players.push(new Player ('Example.snk', 'Mobilpadde'));
        players.push(new Player ('smarty-pants.snk', 'Mobilpadde'));
        players.push(new Player('interesting.snk', 'ccscanf'));
        return players.map((s) => s.username);
    }

    compileScripts() {
        players.forEach(element => {
            if (element !== undefined) {
                console.log(element + ' loaded');
                const src = decode(require(`../Scripts/${element.script}`));
                const res: string = ts.transpile(src);
                const script: any = eval(res);
                scripts.push(script);
            }
        });
    }

    getNextAction(idx: number, views): Action[] {
        const sc = scripts[idx];
        const currentAction = sc.Next.call(sc, SnakeApi)(views);
        console.log('Result:', currentAction);

        return currentAction;
    }
}
