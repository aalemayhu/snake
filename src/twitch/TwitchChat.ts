import { Twitch, Message, ChannelUserState } from 'twitch-wrapper-ts';

export class TwitchChat {

constructor(username, channel, token) {
    const twitch: Twitch = new Twitch(username, token, channel);
    twitch.connect();
    twitch.on('connected', () => twitch.send('Connected!!', channel));
    twitch.on('message', (message: Message, channelState: ChannelUserState) => console.log(message));
}

}
