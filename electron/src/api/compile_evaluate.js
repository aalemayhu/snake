const { NodeVM } = require('vm2');
const fs = require('fs');
const request = require('request');

// TODO: make this confi'/tmp/Snake-Scripts/'I
const scriptDirectory = '/tmp/Snake-Scripts';

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
    const path = `${scriptDirectory}/${script}`;
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
    // console.log('Running script for ', username);
    try {
      const NextInSandbox = this.vm.run(script);
      return NextInSandbox(views, sViews, body);
    } catch (e) {
      console.log('bad user script', e);
      return { direction: 'invalid', contains: 'empty' };
    }
  }

  downloadScript(username, script, cb) {
    const scriptPath = `${scriptDirectory}/${username}.snk`;
    const url = script.startsWith('http') ? script : `https://${script}`;
    request(url).pipe(fs.createWriteStream(scriptPath));
    this.payload[username] = this.getSrc(scriptPath);
    cb('done');
  }
}

module.exports = { CompileEvaluate };
