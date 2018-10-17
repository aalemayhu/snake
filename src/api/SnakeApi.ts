import {Action} from './Action';

export namespace SnakeApi {

    export function Move(direction): Action {
        return new Action('move', direction);
    }

    export interface Snake {
        Next(): Action;
    }
}
