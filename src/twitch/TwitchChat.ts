import { Twitch, Message, ChannelUserState } from 'twitch-wrapper-ts';
import { Scraper } from '../scraping/scraper';

const scraper = new Scraper();

 // TwitchChat
export class TwitchChat {

  constructor(username, channel, token) {
    const twitch: Twitch = new Twitch(username, token, channel);
    twitch.connect();
    twitch.on('connected', () => twitch.send('Waiting for commands now!', channel));

    // OnMessage function
    twitch.on('message', (message: Message, channelState: ChannelUserState) => {

      // Watching for !upload
      if (message.content.startsWith('!upload')) {

        let linkToSource = message.content.replace('!upload' , ''); // Removing the !upload so we get the gist link

        // Checks if the link is from gist
        if (linkToSource.indexOf('gist') !== -1) {

          // Check if the link is the raw link
          if (linkToSource.endsWith('.txt') || linkToSource.endsWith('.ts')) {

            // Add https:// because the twitch wrapper cant handle ':' and call the GetPageContent function
            scraper.GetPageContent('https://' + linkToSource.trim(), message.displayName.toString() , (result) => {

              if (result) {
                twitch.send('@' + message.displayName + ' file checked and loaded', message.channel);
              } else {
                twitch.send('@' + message.displayName + ' could not download file', message.channel);
              }

            });
          } else {
            // Write chat message because link isnt the raw link
            twitch.send('@' + message.displayName + ' please use the gist raw link', message.channel);
          }
        } else {
          // Write chat message because the link isnt a gist link
          twitch.send('@' + message.displayName + ' please use Gist to upload your file', message.channel);
        }
      }
    });
  }

}
