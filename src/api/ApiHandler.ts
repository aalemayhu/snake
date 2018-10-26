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

  static baseURL = 'http://localhost:3000';
  // TODO: make the client_id configurable
  static clientID = 'itet5zjq7dlg8ywx4v470rihamhmbr';

  constructor() {
    console.log('Handler initialized');
  }

  addScripts(users: string[]): string[] {
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

    axios.post(`${ApiHandler.baseURL}/compile-script`, {
      payload: payload
    }).then(response => {
      // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
    }).catch(error => {
      if (error) {
        console.log('Error during compile -> ', error);
      }
    });
  }

  getNextAction(idx: number, snake: Snake, views: View[], cb) {
    axios.post(`${ApiHandler.baseURL}/next-action`, {
      username: snake.username,
      views: views,
      body: snake.getBody()
    }).then(({ data }) => {
      cb(data);
    }).catch(error => {
      if (error) {
        console.log('got error -> ', error);
      }
    });
  }

  static newScript(messageSender, linkToSource, cb, err) {
    axios.post(`${ApiHandler.baseURL}/new-script`, {
      username: messageSender,
      script: linkToSource
    }).then(({ data }) => cb(data)).catch((error) => err(error));
  }

  static getChatters(channel, cb) {
    axios({
        method: 'get',
        url: `https://tmi.twitch.tv/group/user/${channel}/chatters`
    }).then(({ data }) => cb(data))
    .catch((error) => console.log('getChatters', error));
  }

  static getConfig(cb) {
    axios.get(`${ApiHandler.baseURL}/get-config`)
    .then(({ data }) => cb(data))
    .catch(e => console.log(e));
  }

  static getAvatarData(url, cb) {
    axios.get(`${url}?client_id=${ApiHandler.clientID}`)
      .then(({ data }) => cb(data))
      .catch(error => console.log('fetch error ', error));
  }
}
