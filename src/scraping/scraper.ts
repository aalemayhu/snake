import rp from 'request-promise';
import cheerio from 'cheerio';
import request from 'request';
import axios from 'axios';
import fs from 'fs';
import filesaver from 'file-saver';

export class Scraper {
    constructor() {}

    static GetRawUrl(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (url.indexOf('raw') > -1) {
                resolve(url);
            }

            axios.get(url)
                .then((d) => {
                    resolve(
                        'https://gist.github.com/' + 
                        require('cheerio').load(d.data)('.file-actions .btn').attr('href')
                    );
                });
        });
    }

    // Method to get the user script from gist
    GetPageContent(url, username, callback): boolean {
        const filePath = url + '';
        let requestResult = false;

        if (url.indexOf('raw') === -1) {
            url = Scraper.GetRawUrl(url);
        }

        // Request the userscript
        const req = request(url, function (error, response, body) {
            console.log('Errors: ' + '\n' + 'Response: ' + response.statusCode + '\n');

            // Checks if there was an error requesting
            if (error === null && response.statusCode === 200) {
                requestResult = true;

                // TODO Wait for electron so its saved locally
                // Save the content of the userscript to a new file (username.ts)
                const filename = username + '.ts';
                const blob = new Blob([body], {type: 'text/plain;charset=utf-8'});
                filesaver.saveAs(blob, filename);

                // Returns the result of the request
                callback(requestResult);
            }
        });
        console.log(requestResult);

        return requestResult;
    }
}
