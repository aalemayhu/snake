import * as ts from 'typescript';
import { readFileSync } from 'fs';

import { SnakeApi } from './SnakeApi';
import { Action } from './Action';

let scriptsPaths: string [] = new Array(1000);
let scripts: SnakeApi.Snake [] = new Array(1000);

export class ApiHandler {
    constructor() {
        console.log('Handler initialized');
    }

    AddScripts() {
        // Get files in directory
        scriptsPaths.push('\\src\\Scripts\\Example.ts'); // add file to array
    }

    GetAllScripts() {
       /* scriptsPaths.forEach(element => {
            if (element !== undefined) {
                console.log(element + ' loaded');
                const src = readFileSync(element, 'utf-8');
                console.log('TEST');
                const res = ts.transpile(src);
                const script = eval(res);
                scripts.push(script);
            }
        });*/
    }

    RunScript(): Action[] {
       let actions: Action [] = new Array(1000);
       /* console.log(scripts[0]);
            scripts.forEach(sc => {
                if (sc !== undefined) {
                    let currentAction = sc.Run();
                    actions.push(currentAction);
                    console.log('Result: ' + currentAction);
                }
            });*/
        return actions;
    }
}
