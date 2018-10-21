const decode = require('decode');
const { Player } = require('./player.js');

class ApiHandler {

  constructor() {
    console.log('Handler initialized');
    this.players = [];
    this.scripts = [];
  }

  addScripts(users) {
    // TODO: Load all users in the chat, use default script for users who have not uploaded a script
    users.forEach((u) => {
      if (u === 'mobilpadde') {
        this.players.push(new Player('smarty-pants.snk', u));
      } else {
        this.players.push(new Player('interesting.snk', u));
      }
    });

    return users.map(u => u);
  }

  // Workaround so the code works in CI and electron
  getSrc(script) {
    try {
      return decode(require(`/tmp/Snake-Scripts/${script}`));
    } catch (e) {
      return decode(require(`../Scripts/${script}`));
    }
  }

  compileScripts() {
    this.players.forEach((element) => {
      console.log('compileScripts', element);
      if (element !== undefined) {
        // TODO: use a defined configuration variable for the location of user scripts
        console.log(`Loaded ${element.script} for ${element.username}`);
        // const src = this.getSrc(element.script);
        // const res = ts.transpile(src);
        // this.scripts.push(eval(res));
      }
    });
  }

  getNextAction(idx, snake, views) {
    // const sc = this.scripts[idx];
    // const currentAction = sc.Next.call(sc, snake, SnakeApi)(views);

    return 'left';
  }
}

module.exports = { ApiHandler };
