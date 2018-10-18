// General action class that should be used by everybody to pass actions
export class Action {
    readonly type: string;
    readonly direction: string;
    constructor(type: string, direction: string) {
      this.type = type.toLowerCase();
      this.direction = direction.toLowerCase();
    }
}
