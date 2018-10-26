# The SNAKE API

You can control a snake on screen on the [ccscanf][0] channel.  By default
viewers get a snake running the `interesting.snk` file. The default script is
not optimised. To get more points on the leaderboard, write your improved
version.

### Supported actions

|           |
| --------- |
| `forward` |
| `left`    |
| `right`   |

## Writing your first SNAKE agent

The game runs user submitted scripts in a VM. Your script needs to handle the
`Next` function call and return a valid action to be performed in the update
loop for the game.

The `Next` function receives two arguments `views`, and `body`.

- `views` is the surrounding of the player with descriptions like `wall`, `empty`, `treat`.
- `body` the snake's body positions.

You can use the below script as a starting point for your snake agent.

```javascript
module.exports = function Next(views, body) {
    const directions = ['forward', 'right', 'left'];

    const treatMatch = views.find(v => { return v == "treat"});
    if (treatMatch) {
      return treatMatch.direction;
    }

    let possibleActions = directions;

    const wallMatch = views.findIndex(v => { return v === "wall" });
    if (wallMatch !== -1) {
      possibleActions.splice(wallMatch, 1);
    }
    const rnd = ~~(Math.random() * possibleActions.length);
    let a = views.find(v => { return v.direction == possibleActions[rnd]; });
    return a.direction;
};
```

[0]: https://twitch.tv/ccscanf
