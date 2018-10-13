import { Twitch, Message, ChannelUserState } from 'twitch-wrapper-ts';
import { Scraper } from '../scraping/scraper';

const scraper = new Scraper();

export class TwitchChat {

  constructor(username, channel, token) {
    const twitch: Twitch = new Twitch(username, token, channel);
    twitch.connect();
    twitch.on('connected', () => twitch.send('Waiting for commands now!', channel));
    twitch.on('message', (message: Message, channelState: ChannelUserState) => {
      if (message.content.startsWith('!upload')) {
        let linkToSource = message.content.replace('!upload' , '');
        if (linkToSource.indexOf('gist') !== -1) {
          if(linkToSource.endsWith('.txt') || linkToSource.endsWith('.ts')){
            scraper.GetPageContent('https://' + linkToSource.trim(), message.displayName.toString() , (result) => {
              if (result) {
                twitch.send('@' + message.displayName + ' file checked and loaded', message.channel);
              } else {
                twitch.send('@' + message.displayName + ' could not download file', message.channel);
              }
            });
          } else {
            twitch.send('@' + message.displayName + ' please use the gist raw link', message.channel);
          }
        } else {
          twitch.send('@' + message.displayName + ' please use Gist to upload your file', message.channel);
        }
      }
    });
  }

}
