import { Twitch, Message, ChannelUserState } from 'twitch-wrapper-ts';
import { Scraper } from '../scraping/scraper';

const scraper = new Scraper();

export class TwitchChat {

constructor(username, channel, token) {
    const twitch: Twitch = new Twitch(username, token, channel);
    twitch.connect();
    twitch.on('connected', () => twitch.send('Waiting for commands now!', channel));
    twitch.on('message', (message: Message, channelState: ChannelUserState) => {
        if(message.content.startsWith('!upload')){
            var linkToSource = message.content.replace('!upload' , '');
            if(linkToSource.indexOf('gist') != -1){
                var result = scraper.GetPageContent('https://' + linkToSource.trim());
                if(result){
                    twitch.send('@' + message.displayName + ' file checked and loaded', message.channel);
                }else{
                    twitch.send('@' + message.displayName + ' could not download file', message.channel);
                }
            }else{
                twitch.send('@' + message.displayName + ' please use Gist to upload your file', message.channel)
            }
        }
    });
}

}
