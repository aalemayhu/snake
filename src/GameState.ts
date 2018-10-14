export namespace GameState {
    let teams: String [] = new Array(100);
    let players: String [] = new Array(100);

    export function AddPlayerToTeam(player: string, team: string) {
        if (teams.indexOf(team) === -1) {
            teams.push(team);
        }
        players.push(player + '~' + team);
    }

    export function GetTeamOfPlayer(player: string): string {
        let team = '';
        let firstFoundEntry = null;
        players.forEach(element => {
            if (element !== undefined) {
                console.log(element);
                if (element.startsWith(player)) {

                    if (firstFoundEntry !== null) {
                        players.splice(players.indexOf(firstFoundEntry), 1);
                    }
                    team = element.replace(player + '~', '');
                    firstFoundEntry = element;
                }
            }
        });
        console.log('-------------------------------------------');
        return team;
    }
}