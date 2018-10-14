export module GameState {
    let teams: String [] = new Array(100);
    let players: String [] = new Array(100);

    export function AddPlayerToTeam(player: string, team: string) {
        if(teams.indexOf(team) === -1) {
            teams.push(team);
        }
        if(players.indexOf(player) !== -1)
        console.log('Adding to players: ' + player + '~' + team);
        players.push(player + '~' + team);
    }

    export function GetTeamOfPlayer(player: string) : string {
        let team = '';
        players.forEach(element => {
            if(element !== undefined){
                if(element.startsWith(player)){
                    console.log('Found element for player: ' + element);
                    team = element.replace(player + '~', '')
                    console.log('Got this team for the player: ' + team);
                }
            }
        });

        if(team === ''){
            console.log('cannot find player')
        }

        return team;
    }
}