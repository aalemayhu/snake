const { remote, ipcRenderer } = require('electron');
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

$('body').css('background', 'gray');

$('#game-container').css('width', '80%');
$('#game-container').css('height', '80%');

// View changes from the main process

ipcRenderer.on('config-loaded', (event, config) => {
  $('#bot-name').val(config.botName);
  $('#channel-name').val(config.channel);
  $('#bot-token').val(config.token);
});
