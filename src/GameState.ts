export namespace GameState {
    let teams: String [] = new Array(100);
    let players: String [] = new Array(100);

    // Function to add player to a team
    // saved in the players array inf the following format 'player~team'
    export function AddPlayerToTeam(player: string, team: string) {

        // Check if the team exists if not add it to the teams array
        if (teams.indexOf(team) === -1) {
            teams.push(team);
        }

        // Assign player to the team
        players.push(player + '~' + team);
    }

    // Function to get the team for a specific player
    export function GetTeamOfPlayer(player: string): string {
        let team = '';
        let firstFoundEntry = null;

        // Loop over the players array
        players.forEach(element => {

            // Check if element is undefined
            if (element !== undefined) {

                // Check if element starts with the username of the player
                if (element.startsWith(player)) {

                    // Check if firstFoundEntry set. If is set remove the entry
                    if (firstFoundEntry !== null) {
                        players.splice(players.indexOf(firstFoundEntry), 1);
                    }

                    // Remove the username and the '~' char from the element string to get the team
                    team = element.replace(player + '~', '');

                    // Save this entry in case there is another one
                    firstFoundEntry = element;
                }
            }
        });
        console.log('-------------------------------------------');
        return team;
    }
}