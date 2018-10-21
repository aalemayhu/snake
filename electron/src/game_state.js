class GameState {
  constructor(teams, players) {
    this.teams = teams;
    this.players = players;
  }

  addPlayerToTeam(player, team) {
    if (this.teams.indexOf(team) === -1) {
      this.teams.push(team);
    }
    this.players.push(`${player}~${team}`);
  }

  getTeamOfPlayer(player) {
    let team = '';
    let firstFoundEntry = null;

    this.players.forEach((element) => {
      if (element) {
        if (element.startsWith(player)) {
          if (firstFoundEntry !== null) {
            this.players.splice(this.players.indexOf(firstFoundEntry), 1);
          }
          team = element.replace(`${player}~`, '');
          firstFoundEntry = element;
        }
      }
    });
    return team;
  }
}

module.exports = { GameState };
