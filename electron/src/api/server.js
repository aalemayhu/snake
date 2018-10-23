import { remote } from 'electron';
const express = require('express');
const bodyParser = require('body-parser');
const { CompileEvaluate } = require('./compile_evaluate.js');

const app = express();
const port = 3000;

let gameState = 'Pause';
const compiler = new CompileEvaluate([]);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
}));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/set-state', (req, res) => {
  gameState = req.body.gameState;
  res.send('OK');
});

app.get('/get-state', (req, res) => {
  res.json({ gameState });
});

app.post('/next-action', (req, res) => {
  const p = req.body;
  const c = compiler.getNextAction(p.username, p.views, p.sViews, p.body);
  res.json(c);
});

app.post('/compile-script', (req, res) => {
  compiler.compileScripts(req.body.payload);
  res.json('OK');
});

app.post('/new-script', (req, res) => {
  const p = req.body;
  compiler.downloadScript(p.username, p.script, () => {
    res.json('OK');
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
