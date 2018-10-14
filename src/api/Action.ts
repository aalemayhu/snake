// General action class that should be used by everybody to pass actions
export class Action {

    // Example: move
    private _actionType: string;
    public get ActionType(): string {
        return this._actionType;
    }
    public set ActionType(v: string) {
        this._actionType = v;
    }

    private _actionDirection: string;
    public get ActionDirection(): string {
        return this._actionDirection;
    }
    public set ActionDirection(v: string) {
        this._actionDirection = v;
    }
}