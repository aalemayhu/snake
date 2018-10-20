import { Twitch, Message, ChannelUserState } from 'twitch-wrapper-ts';
import axios from 'axios';

import { Scraper } from '../scraping/scraper';
import { GameState } from '../GameState';

const scraper = new Scraper();

 // TwitchChat
export class TwitchChat {

  private channel: string;
  private subscribers = [];
  private users: string[] = [];

  constructor(username, channel, token) {
    this.channel = channel;

    const twitch: Twitch = new Twitch(username, token, channel);
    twitch.connect();
    twitch.on('connected', () => twitch.send('Waiting for commands now!', channel));

    // OnMessage function
    twitch.on('message', (message: Message, channelState: ChannelUserState) => {

      let messageContent = message.content.toLowerCase();
      let messageChannel = message.channel;
      let messageSender = message.displayName;

      // Watching for !upload
      if (messageContent.startsWith('!upload')) {

        let linkToSource = messageContent.replace('!upload' , ''); // Removing the !upload so we get the gist link

        // Checks if the link is from gist
        if (linkToSource.indexOf('gist') !== -1) {

          // Check if the link is the raw link
          if (linkToSource.endsWith('.txt') || linkToSource.endsWith('.ts')) {

            // Add https:// because the twitch wrapper cant handle ':' and call the GetPageContent function
            scraper.GetPageContent('https://' + linkToSource.trim(), messageSender.toString() , (result) => {

              if (result) {
                twitch.send('@' + messageSender + ' file checked and loaded', messageChannel);
              } else {
                twitch.send('@' + messageSender + ' could not download file', messageChannel);
              }

            });
          } else {
            // Write chat message because link isnt the raw link
            twitch.send('@' + messageSender + ' please use the gist raw link', messageChannel);
          }
        } else {
          // Write chat message because the link isnt a gist link
          twitch.send('@' + messageSender + ' please use Gist to upload your file', messageChannel);
        }
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
        url: `https://cors-anywhere.herokuapp.com/https://tmi.twitch.tv/group/user/${this.channel}/chatters`,
        // headers: { 'Origin': 'snake' }
    })
        .then(({ data }) => cb(Object.values(data.chatters.viewers)));
  }

  subscribeToUsers(sub) {
    this.subscribers.push(sub);
  }

}
