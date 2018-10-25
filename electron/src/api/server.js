const express = require('express');
const bodyParser = require('body-parser');
const { CompileEvaluate } = require('./compile_evaluate.js');
const { fsCache } = require('../util/electron-caches.js');

const app = express();
const port = 3000;

let config = { };
const compiler = new CompileEvaluate([]);

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
  console.log('next-action -> ', p.username, c);
  res.json(c);
});

app.post('/compile-script', (req, res) => {
  compiler.compileScripts(req.body.payload);
  res.json('OK');
});

app.post('/new-script', (req, res) => {
  const p = req.body;
  if (!p.script.startsWith('gist.githubusercontent.com') === -1) {
    res.json({ verdict: 'Script rejected, use a gist raw link (no http prefix)' });
    return;
  }
  // Let the compiler know that we are loading a new script for the user
  compiler.payload[p.username] = 'empty';
  fsCache.downloadScript(p.username, p.script, (verdict) => {
    res.json(verdict);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
