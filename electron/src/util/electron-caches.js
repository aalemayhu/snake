const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const snakeCacheDirectory = path.join(app.getPath('home'), 'snake-game-cache');
const secretFile = path.join(snakeCacheDirectory, 'secret.json');

function createCacheDirectory() {
  if (fs.existsSync(snakeCacheDirectory) === false) {
    fs.mkdirSync(snakeCacheDirectory);
  }
}

const fsCache = {
  config() {
    const data = this.readAll(secretFile);
    if (data) {
      if (!data.gameState) { data.gameState = 'Pause'; }
      return data;
    }
    return {
      botName: 'please-fill-out',
      channel: 'please-fill-out',
      clientId: 'please-fill-out',
    };
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
    } catch (err) { /* ignored err */ }
    return data;
  },
  saveAll(data) {
    createCacheDirectory();
    fs.writeFileSync(secretFile, JSON.stringify(data, null, 2));
  },
};

module.exports = {
  fsCache,
};
