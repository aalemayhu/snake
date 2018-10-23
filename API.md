# The SNAKE API

You can control a snake on screen on the [ccscanf][0] channel.  By default
viewers get a snake running the `interesting.snk` file. The default script is
not optimized. If you want get a ahead on the leaderboard, you need to write
your own.

## Writing your first SNAKE agent

The game runs user submitted scripts in a VM. Your script needs to handle the
`Next` action call. `Next` should return a view action to be performed in the
update loop for the game.

The `Next` function receives three arguments `views`, `sViews`, and `body`.

- `views` is the surronding of the player with descriptions like `wall`, `empty`, `treat`.
- `sViews` is similiar to views but gives you the coordinates on the grid.
- `body` the snake's body positions.

You can use the below script as a starting point for your snake agent.

```javascript
module.exports = function Next(views, sViews, body) {
    const directions = ['up', 'down', 'right', 'left'];

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
    return a;
};
```

[0]: https://twitch.tv/ccscanf
