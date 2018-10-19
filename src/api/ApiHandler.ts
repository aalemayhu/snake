import * as ts from 'typescript';
import { decode } from 'utf8';

import { SnakeApi } from './SnakeApi';
import { Action } from './Action';
import { Player } from './Player';
import { View } from './View';
import { Snake } from '../prefabs/snake';

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

    // Workaround so the code works in CI and electron
    getSrc(script): string {
        try {
            return decode(require(`/tmp/Snake-Scripts/${script}`));
        } catch (e) {
            return decode(require(`../Scripts/${script}`));
        }
    }

    compileScripts() {
        this.players.forEach(element => {
            console.log('compileScripts', element);
            if (element !== undefined) {
                // TODO: use a defined configuration variable for the location of user scripts
                console.log(`Loaded ${element.script} for ${element.username}`);
                const src = this.getSrc(element.script);
                const res: string = ts.transpile(src);
                const script: any = eval(res);
                this.scripts.push(script);
            }
        });
    }

    getNextAction(idx: number, snake: Snake, views: View[]): Action[] {
        const sc = this.scripts[idx];
        const currentAction = sc.Next.call(sc, snake, SnakeApi)(views);

        return currentAction;
    }
}
