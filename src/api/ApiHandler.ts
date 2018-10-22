import * as ts from 'typescript';
import { decode } from 'utf8';

import { SnakeApi } from './SnakeApi';
import { Action } from './Action';
import { Player } from './Player';
import { View } from './View';
import { Snake } from '../prefabs/snake';
import axios from 'axios';

export class ApiHandler {
  players: Player[] = [];
  scripts: SnakeApi.Snake [] = new Array();

  constructor() {
    console.log('Handler initialized');
  }

  addScripts(users: string[]): string[] {
    // TODO: Load all users in the chat, use default script for users who have not uploaded a script
    users.forEach((u) => {
      if (u === 'mobilpadde') {
        this.players.push(new Player('smarty-pants.snk', u));
      } else {
        this.players.push(new Player('interesting.snk', u));
      }
    });

    return users.map((u) => u);
  }

  compileScripts() {
    let payload = {};
    this.players.forEach(element => {
      payload[element.username] = element.script;
    });

    axios.post('http://localhost:3000/compile-script', {
      payload: payload
    }).then(response => {
      // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
    }).catch(error => {
      if (error) {
        console.log('got error -> ', error);
      }
    });
  }

  getNextAction(idx: number, snake: Snake, views: View[], cb) {
    axios.post('http://localhost:3000/next-action', {
      username: snake.username,
      views: views
    }).then(({ data }) => {
      cb(data.action);
    }).catch(error => {
      if (error) {
        console.log('got error -> ', error);
      }
    });
  }
}
