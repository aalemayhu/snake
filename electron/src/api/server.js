const express = require('express');
const bodyParser = require('body-parser');
const { CompileEvaluate } = require('./compile_evaluate.js');

const app = express();
const port = 3000;

const compiler = new CompileEvaluate([]);

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
}));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/next-action', (req, res) => {
  console.log('next-action', req.body);
  res.json(compiler.getNextAction(req.body.username, req.body.views));
});

app.post('/compile-script', (req, res) => {
  console.log('compile-script', req.body);
  compiler.compileScripts(req.body.payload);
  res.json('OK');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
