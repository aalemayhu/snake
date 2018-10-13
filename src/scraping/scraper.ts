const rp = require('request-promise');
const cheerio = require('cheerio');

export class Scraper{
    constructor(){}

    GetPageContent(url){
        const options = {
            uri: url,
            transform: function (body) {
              return cheerio.load(body);
            }
        };
        rp(options)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }      
}