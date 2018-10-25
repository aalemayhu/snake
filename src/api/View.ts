// The view of a direction
export class View {

    // up, down, left, right
    readonly direction: string;
    // empty, snake, treat, player
    readonly contains: string;

    constructor(direction: string, contains: string) {
        this.direction = direction;
        this.contains = contains;
    }
}
