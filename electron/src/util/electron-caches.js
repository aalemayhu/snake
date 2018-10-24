const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const snakeCacheDirectory = path.join(app.getPath('home'), 'snake-game-cache');
const snakeConfigFile = path.join(snakeCacheDirectory, 'data.json');

function createCacheDirectory() {
  if (fs.existsSync(snakeCacheDirectory) === false) {
    fs.mkdirSync(snakeCacheDirectory);
  }
}

const fsCache = {
  config() {
    const data = this.readAll(`${snakeCacheDirectory}/secret.json`);
    if (data) {
      return data;
    }
    return {
      botName: 'please-fill-out',
      channel: 'please-fill-out',
      clientId: 'please-fill-out',
    };
  },
  save(name, value) {
    createCacheDirectory();
    const newData = this.readAll(snakeConfigFile);
    newData[name] = value;
    fs.writeFileSync(snakeConfigFile, JSON.stringify(newData, null, 2));
  },
  readAll(file) {
    let data = {};

    createCacheDirectory();
    try {
      const cacheContent = fs.readFileSync(file, 'utf-8');

      try {
        const d = JSON.parse(cacheContent);
        data = d;
      } catch (e) {
        data = {};
      }
    } catch (err) {
      console.log('Error in Cache:', err);
    }
    return data;
  },
};

module.exports = {
  fsCache,
};
