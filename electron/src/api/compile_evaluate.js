const { NodeVM } = require('vm2');
const { fsCache } = require('../util/electron-caches.js');

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

  compileScripts(payload) {
    for (const key in payload) {
      const userScript = `${key}.snk`;
      if (fsCache.scriptExists(userScript)) {
        this.payload[key] = fsCache.getSrc(userScript);
      } else {
        this.payload[key] = fsCache.getSrc(payload[key]);
      }
    }
  }

  getNextAction(username, views, sViews, body) {
    // Hot reload the missing script
    if (this.payload[username] === 'empty') {
      this.payload[username] = fsCache.getSrc(`${username}.snk`);
    }
    const script = this.payload[username];
    try {
      const NextInSandbox = this.vm.run(script);
      const v = NextInSandbox(views, sViews, body);
      return v;
    } catch (e) {
      console.log(`bad user script, ${username}`, e);
      return 'invalid';
    }
  }
}

module.exports = { CompileEvaluate };
