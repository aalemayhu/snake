import rp from 'request-promise';
import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';
import filesaver from 'file-saver';

export class Scraper {
  constructor() {}

  GetPageContent(url, username, callback): boolean {
    let requestResult = false;
    let filePath = url + '';

      let req = request(url, function (error, response, body) {
        console.log('Errors: ' + '\n' + 'Response: ' + response.statusCode + '\n');

        if (error === null && response.statusCode === 200) {
          requestResult = true;

          console.log(username);

          //TODO Wait for electron so its saved locally
          let filename = username + '.ts'
          var blob = new Blob([body], {type: "text/plain;charset=utf-8"});
          filesaver.saveAs(blob, filename);

          callback(requestResult);
        }

      });
      
    console.log(requestResult);
    return requestResult;
  }
}
