// Basic script skeleton
import { Snake } from '../api/SnakeApi';
import { Action } from '../api/Action';

export function run(): Action {
    let rnd = Math.floor(Math.random() * (4 - 1 + 1)) + 4;
    let action;

  switch (rnd) {
    case 1:
        action = Snake.Move('up');
        break;
    case 2:
        action = Snake.Move('right');
        break;
    case 3:
        action = Snake.Move('right');
        break;
    case 4:
        action = Snake.Move('right');
        break;
    default:
        break;
  }

  return action;
}