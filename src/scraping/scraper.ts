import rp from 'request-promise';
import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';

export class Scraper {
  constructor() {}

  GetPageContent(url, username, callback): boolean {
    let requestResult = false;
    let req = request(url, function (error, response, body) {
      console.log('Errors: ' + '\n' + 'Response: ' + response.statusCode + '\n');
      if (error === null && response.statusCode === 200) {
        requestResult = true;
        callback(requestResult);
        console.log(requestResult);
      }
    });
    req.pipe(fs.createWriteStream('./' + username + '.js'));
    console.log(requestResult);
    return requestResult;
  }
}
