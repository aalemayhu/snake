import { Snake } from './SnakeApi';


export class ApiHandler {
  scripts: Snake [];

  constructor() {
    this.scripts = [];
  }

  LoadAllScripts() {
    // Get files in directory
    this.scripts.push(); // add file to array
  }

  RunAllScripts() {
    this.scripts.forEach(element => {
      element.Run();
    });
  }
}
