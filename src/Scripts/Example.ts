// Basic script skeleton
import { SnakeApi } from '../api/SnakeApi';
import { Action } from '../api/Action';

class AnyThing implements SnakeApi.Snake {
    Run(): Action {
        let rnd = Math.floor(Math.random() * (4 - 1 + 1)) + 4;
        let action;

      switch (rnd) {
        case 1:
            action = SnakeApi.Move('up');
            break;
        case 2:
            action = SnakeApi.Move('right');
            break;
        case 3:
            action = SnakeApi.Move('right');
            break;
        case 4:
            action = SnakeApi.Move('right');
            break;
        default:
            break;
      }

      return action;
    }
}