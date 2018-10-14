import { SnakeApi } from './SnakeApi';
import { Snake } from '../prefabs/Snake';

let scripts: string [] = new Array(1000);

export class ApiHandler {
    constructor() {}

    LoadAllScripts() {
        // Get files in directory
        scripts.push('../Scripts/Example.ts'); // add file to array
    }

    RunAllScripts() {
        scripts.forEach(element => {
            if (element !== undefined) {
                this.RunScript(element);
            }
        });
    }

    RunScript(path: string) {
        import(path).then(script => {
            script.Run();
        });
    }
}
