import {Action} from './Action';

export namespace SnakeApi {

    export function Collect(direction): Action {
        let action = new Action();
        action.ActionType = 'collect';
        action.ActionDirection = direction;
        return action;
    }

    export function Attack(direction): Action {
        let action = new Action();
        action.ActionType = 'attack';
        action.ActionDirection = direction;
        return action;
    }

    export function Heal(direction): Action {
        let action = new Action();
        action.ActionType = 'heal';
        action.ActionDirection = direction;
        return action;
    }

    export function Move(direction): Action {
        let action = new Action();
        action.ActionType = 'move';
        action.ActionDirection = direction;
        return action;
    }

    export function Watch(direction): Action {
        // TODO Has to return something else
        let action = new Action();
        action.ActionType = 'watch';
        action.ActionDirection = direction;
        return action;
    }

    export interface Snake {
        Next(): Action;
    }
}
