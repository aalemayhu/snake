const { ipcRenderer } = require('electron');
const $ = require('jQuery');

const stateButton = $('#game-state-button');
stateButton.click(() => {
  if (stateButton.text() === 'Pause') {
    console.log('Pause the game');
    stateButton.text('Play');
  } else {
    stateButton.text('Pause');
    console.log('Unpause the game');
  }
  ipcRenderer.send('update-game', stateButton.text())
})
