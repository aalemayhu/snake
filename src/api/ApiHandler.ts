import * as ts from 'typescript';
import { readFileSync } from 'fs';

import { SnakeApi } from './SnakeApi';

let scripts: string [] = new Array(1000);

export class ApiHandler {
    constructor() {}

    LoadAllScripts() {
        // Get files in directory
        scripts.push('../Scripts/Example'); // add file to array
    }

    RunAllScripts() {
        scripts.forEach(element => {
            if (element !== undefined) {
                console.log(element + 'loaded');
                this.RunScript(element);
            }
        });
    }

    RunScript(path: string) {
       // (async () => {
            const src = readFileSync(path, 'utf-8');
            const res = ts.transpile(src);
            const script = eval(res);

            let action = script.Run();
            console.log(action);
        /*  })().catch(err => {
            // error handler
          });*/
    }
}
