import * as ts from 'typescript';
import { decode } from 'utf8';

import { SnakeApi } from './SnakeApi';
import { Action } from './Action';

const path = require('path');

let scriptPaths: object [] = new Array();
let scripts: SnakeApi.Snake [] = new Array();

export class ApiHandler {
    constructor() {
        console.log('Handler initialized');
    }

    addScripts() {
        // TODO: Get files in directory
        scriptPaths.push({ script: 'Example.snk', user: 'Mobilpadde'});
        scriptPaths.push({ script: 'smarty-pants.snk', user: 'Mobilpadde'});
        scriptPaths.push({ script: 'interesting.snk', user: 'ccscanf'});

        return scriptPaths.map((s) => s.user);
    }

    compileScripts() {
        scriptPaths.forEach(element => {
            if (element !== undefined) {
                console.log(element + ' loaded');
                const src = decode(require(`../Scripts/${element.script}`));
                const res: string = ts.transpile(src);
                const script: any = eval(res);
                scripts.push(script);
            }
        });
    }

    getNextAction(idx: number, surroundings): Action[] {
        const sc = scripts[idx];
        const currentAction = sc.Next.call(sc, SnakeApi)(surroundings);
        console.log('Result:', currentAction);

        return currentAction;
    }
}
