const Chatbot = require('./chatbot.js');
const axios = require('axios');
const scraper = require('./scraper.js');
const { GameState } = require('../game_state.js');

class TwitchChat {

  constructor(username, channel, token) {
    this.channel = channel;
    this.subscribers = [];
    this.users = [];

    this.state = new GameState([], []);

    this.chatClient = new Chatbot({
      channel: username,
      username: channel,
      password: token,
    });

    this.chatClient.on('message', this.onMessageHandler);
    this.chatClient.on('connected', this.onConnectedHandler);
    this.chatClient.connect();
    // this.chatClient.on('disconnected', onDisconnectedHandler)
    // this.chatClient.on('join', onJoinHandler)
    // this.chatClient.on('hosted', onHostedHandler)

    setInterval(() => this.getUsers((viewers) => {
      this.subscribers.forEach((s) => {
        const curr = s.users();
        const uniq = this.users
        .concat(viewers)
        .filter(v => curr.indexOf(v) < 0);
        s.addUsers(uniq);
      });

      this.users = viewers;
    }), 2500);
  }

  onConnectedHandler(addr, port) {
    console.log(`onConnectedHandler(${addr}, ${port})`);
    this.chatClient.say(this.channel, 'Waiting for commands now!');
  }

  onMessageHandler(target, context, message, self) {
    // Ignore messages from the bot.
    if (self) { return; }
    const messageContent = message.toLowerCase();
    const messageChannel = target;
    const messageSender = context.username;

    // Watching for !upload
    if (messageContent.startsWith('!upload')) {
      const url = messageContent.replace('!upload', '');
      // Checks if the link is from gist
      if (url.indexOf('gist') !== -1) {
        // Check if the link is the raw link
        if (url.endsWith('.txt') || url.endsWith('.ts')) {
          // Add https:// because`https://${  url.trim()}`t handle ':' and call the GetPageContent function
          scraper.GetPageContent(`https://${url.trim()}`, messageSender.toString(), (result) => {
            if (result) {
              this.chatClient.say(messageChannel, `@${messageSender} file checked and loaded`);
            } else {
              this.chatClient.say(messageChannel, `@${messageSender} could not download file`);
            }
          });
        } else {
          // Write chat message because link isnt the raw link
          this.chatClient.say(messageChannel, `@${messageSender} please use the gist raw link`);
        }
      } else {
        // Write chat message because the link isnt a gist link
        this.chatClient.say(messageChannel, `@${messageSender} please use Gist to upload your file`);
      }
    }

    // Watching for !join
    if (messageContent.startsWith('!join')) {
      const teamToJoin = messageContent.replace('!join', '').trim();
      this.state.addPlayerToTeam(messageSender.toLowerCase(), teamToJoin.toLowerCase());
      const joinedTeam = this.state.getTeamOfPlayer(messageSender.toLowerCase());
      this.chatClient.say(messageChannel, `@${messageSender} has joined the team: ${joinedTeam}`);
    }

    // For debugging?
    if (messageContent.startsWith('!team')) {
      const joinedTeam = this.state.getTeamOfPlayer(messageSender.toLowerCase());
      this.chatClient.say(`@${messageSender} is in the team: ${joinedTeam}`, messageChannel);
    }
  }

  getUsers(cb) {
    axios({
      method: 'get',
      url: `https://tmi.twitch.tv/group/user/${this.channel}/chatters`
    })
    .then(({ data }) => cb(Object.values(data.chatters.viewers)));
  }

  subscribeToUsers(sub) {
    this.subscribers.push(sub);
  }
}

module.exports = { TwitchChat }
