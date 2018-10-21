const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request');

function GetRawUrl(url) {
  return new Promise((resolve, reject) => {
    if (url.indexOf('raw') > -1) {
      resolve(url);
    }

    // TODO: change cheerio result to be saved to file instead
    axios.get(url)
    .then((d) => {
      resolve(
        `https://gist.github.com/${
          cheerio.load(d.data)('.file-actions .btn').attr('href')}`,
        );
    });
  });
}

  // Method to get the user script from gist
function GetPageContent(inputUrl, username, callback) {
  let requestResult = false;
  let url = inputUrl;

  if (url.indexOf('raw') === -1) {
    url = GetRawUrl(url);
  }

  request(url, (error, response, body) => {
    // console.log(`${'Errors: ' + '\n' + 'Response: '}${response.statusCode}\n`);
      // Checks if there was an error requesting
    if (error === null && response.statusCode === 200) {
      requestResult = true;

      console.log('TODO: implement the save handling');
        // TODO Wait for electron so its saved locally
        // Save the content of the userscript to a new file (username.ts)
      // const filename = `${username}.ts`;
      // const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      // console.log(`filesaver.saveAs(${blob}, ${filename})`);
        // Returns the result of the request
      callback(requestResult);
    }
  });

  return requestResult;
}

module.exports = {
  GetRawUrl,
  GetPageContent,
};
