import { Twitch, Message, ChannelUserState } from 'twitch-wrapper-ts';
import axios from 'axios';

import { GameState } from '../GameState';

 // TwitchChat
export class TwitchChat {

  private channel: string;
  private subscribers = [];
  private users: string[] = [];

  constructor(username, channel, token) {
    this.channel = channel;

    const twitch: Twitch = new Twitch(username, token, channel);
    twitch.on('connected', () => twitch.send('Waiting for commands now!', channel));

    // OnMessage function
    twitch.on('message', (message: Message, channelState: ChannelUserState) => {
      let messageContent = message.content.toLowerCase().trim();
      let messageChannel = message.channel;
      let messageSender = message.displayName;

      // Watching for !upload
      if (messageContent.startsWith('!upload')) {
        let linkToSource = messageContent.replace('!upload' , ''); // Removing the !upload so we get the gist link
        axios.post('http://localhost:3000/new-script', {
          username: messageSender,
          script: linkToSource.trim()
        }).then(() => {
          twitch.send('@' + messageSender + ' file checked and loaded', messageChannel);
        }).catch((error) => {
          if (error) {
            console.log('Source error -> ', error);
            twitch.send('@' + messageSender + ' could not download file', messageChannel);
          }
        });
      }

      // Watching for !join
      if (messageContent.startsWith('!join')) {
        let teamToJoin = messageContent.replace('!join', '').trim();
        GameState.AddPlayerToTeam (messageSender.toLowerCase(), teamToJoin.toLowerCase());
        let joinedTeam = GameState.GetTeamOfPlayer(messageSender.toLowerCase());
        twitch.send('@' + messageSender + ' has joined the team: ' + joinedTeam, messageChannel);
      }

      // For debugging?
      if (messageContent.startsWith('!team')) {
        let joinedTeam = GameState.GetTeamOfPlayer(messageSender.toLowerCase());
        twitch.send('@' + messageSender + ' is in the team: ' + joinedTeam, messageChannel);
      }
    });

    twitch.connect();

    setInterval(() => this.getUsers((viewers) => {
        this.subscribers.forEach((s) => {
            const curr = s.users();
            const uniq = this.users
                .concat(viewers)
                .filter((v) => curr.indexOf(v) < 0);

            s.addUsers(uniq);
        });

        this.users = viewers;
    }), 2500);
  }

  getUsers(cb) {
    axios({
        method: 'get',
        url: `https://tmi.twitch.tv/group/user/${this.channel}/chatters`
    })
        .then(({ data }) => {
          let users = data.chatters.viewers;
          users.push(...data.chatters.moderators);
          cb(users)
        });
  }

  subscribeToUsers(sub) {
    this.subscribers.push(sub);
  }

}
