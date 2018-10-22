const { NodeVM } = require('vm2');
const fs = require('fs');

class CompileEvaluate {
  constructor(payload) {
    this.payload = payload;
    this.vm = new NodeVM({
      console: 'off',
      sandbox: {},
      require: {
        external: false,
      },
    });
  }

  // Workaround so the code works in CI and electron
  getSrc(script) {
    const path = `/tmp/Snake-Scripts/${script}`;
    return fs.readFileSync(path, 'utf-8');
  }

  compileScripts(payload) {
    console.log('Compiling', payload);
    for (const key in payload) {
      this.payload[key] = this.getSrc(payload[key]);
    }
  }

  getNextAction(username, views, sViews, body) {
    const script = this.payload[username];
    console.log('Running script for ', username);
    const NextInSandbox = this.vm.run(script);
    const currentAction = NextInSandbox(views, sViews, body);
    return currentAction;
  }
}

module.exports = { CompileEvaluate };
