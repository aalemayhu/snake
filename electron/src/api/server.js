const express = require('express');
const bodyParser = require('body-parser');
const { CompileEvaluate } = require('./compile_evaluate.js');
const { fsCache } = require('../util/electron-caches.js');

const app = express();
const port = 3000;

let config = { };
const compiler = new CompileEvaluate([]);
const supportedFiles = ['.ts', '.snk', '.js', '.txt'];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/set-state', (req, res) => {
  config.gameState = req.body.gameState;
  res.send('OK');
});

app.post('/set-config', (req, res) => {
  config = req.body;
  res.send('OK');
});

app.get('/get-config', (req, res) => {
  res.json(config);
});

app.post('/next-action', (req, res) => {
  const p = req.body;
  const c = compiler.getNextAction(p.username, p.views, p.sViews, p.body);
  if (c.direction !== 'invalid') {
    console.log('next-action -> ', p.username, c);
  }
  res.json(c);
});

app.post('/next-action-batch', (req, res) => {
  const actions = req.body.payload
    .map(p => ({
      username: p.username,
      action: compiler.getNextAction(p.username, p.views, p.sViews, p.body)
    }));
  res.json(actions);
});

app.post('/compile-script', (req, res) => {
  compiler.compileScripts(req.body.payload);
  res.json('OK');
});

app.post('/new-script', (req, res) => {
  const regex = /(?:https?:\/\/)?(gist\.githubusercontent.*(\.(snk)|(txt)|(js)|(ts)))/gi;
  const p = req.body;

  const matches = p.script.match(regex);
  if (!matches || matches.length <= 0) {
    const v = `Script rejected, use a gist raw link (no http prefix)
      file has to end in either ${supportedFiles}`;
    res.json({ verdict: v });
    return;
  }
  fsCache.downloadScript(p.username, p.script, (verdict) => {
    if (!verdict.verdict.includes('rejected')) {
      // Let the compiler know that we are loading a new script for the user
      compiler.payload[p.username] = 'empty';
    }
    res.json(verdict);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
