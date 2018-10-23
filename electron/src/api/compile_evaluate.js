const { NodeVM } = require('vm2');
const fs = require('fs');
const request = require('request');

// TODO: move all of the filesystem stuff out of here.
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
    for (const key in payload) {
      const userScript = `${scriptDirectory}/${key}.snk`;
      if (fs.existsSync(userScript)) {
        this.payload[key] = this.getSrc(`${key}.snk`);
      } else {
        this.payload[key] = this.getSrc(payload[key]);
      }
    }
  }

  getNextAction(username, views, sViews, body) {
    if (this.payload[username] === 'empty') {
      this.payload[username] = this.getSrc(`${username}.snk`);
    }
    const script = this.payload[username];
    try {
      const NextInSandbox = this.vm.run(script);
      const v = NextInSandbox(views, sViews, body);
      return v;
    } catch (e) {
      console.log('bad user script', e);
      return { direction: 'invalid', contains: 'empty' };
    }
  }

  downloadScript(username, script, cb) {
    if (!script.startsWith('gist.githubusercontent.com') === -1) {
      cb({ verdict: 'Script rejected, use a gist raw link (no http prefix)' });
      return;
    }
    const scriptPath = `${scriptDirectory}/${username}.snk`;
    const url = script.startsWith('http') ? script : `https://${script}`;
    request(url).pipe(fs.createWriteStream(scriptPath));
    this.payload[username] = 'empty';
    cb({ verdict: `@${username} script accepted!` });
  }
}

module.exports = { CompileEvaluate };
