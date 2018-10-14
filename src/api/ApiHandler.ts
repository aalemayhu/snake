import { SnakeApi } from './SnakeApi';
import { DynamicLoader } from 'dynamic-modules';

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
                this.RunScript(element);
            }
        });
    }

    RunScript(path: string) {
        (async () => {
            const someModule = await DynamicLoader.loadModuleByPath(path);
            someModule.Run();
          })().catch(err => {
            // error handler
          });
    }
}