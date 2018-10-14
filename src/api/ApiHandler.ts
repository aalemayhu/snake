import { Snake } from './SnakeApi';

let scripts: Snake [];
scripts = [];

export class ApiHandler {
    constructor() {}

    LoadAllScripts() {
        // Get files in directory

        scripts.push(); // add file to array
    }

    RunAllScripts() {
        scripts.forEach(element => {
            element.Run();
        });
    }
}