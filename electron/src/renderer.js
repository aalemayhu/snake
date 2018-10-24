const { ipcRenderer } = require('electron');
const $ = require('jQuery');

const stateButton = $('#game-state-button');
stateButton.click(() => {
  if (stateButton.text() === 'Pause') {
    stateButton.css('class', 'btn btn-success float-right');
    stateButton.text('Play');
  } else {
    stateButton.css('class', 'btn btn-secondary float-right');
    stateButton.text('Pause');
  }
  ipcRenderer.send('update-game', stateButton.text());
});

$('body').css('background', '#34ace0');

$('#game-container').css('width', '70%');
$('#game-container').css('height', '70%');

// View changes from the main process
// TODO: figure out why this is not being invoked
ipcRenderer.on('config-loaded', (event, config) => {
  console.log('config-loaded');
  $('#bot-name').text(config.botName);
  $('#channel-name').text(config.channel);
  $('#bot-token').text(config.token);
});
