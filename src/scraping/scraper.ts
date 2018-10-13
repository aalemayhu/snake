import rp from 'request-promise';
import cheerio from 'cheerio';
import request from 'request';

export class Scraper {
  constructor() {}

  GetPageContent(url, callback) : boolean {
    var requestResult = false;
    request(url, function (error, response, body) {
      console.log('Errors: ' + '\n' + 'Response: ' + response.statusCode + '\n');
      if(error === null && response.statusCode === 200){
        requestResult = true;
        callback(requestResult);
        console.log(requestResult);
      }
    });
    console.log(requestResult);
    return requestResult;
  }
}
