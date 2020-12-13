export type TPlayer = 'p1' | 'p2';
type TPlayers = { [K in TPlayer]: IPlayer };

export interface IRoom extends TPlayers {
  playerList: string[];
  board: IBoard;
  turn: string;
  start: boolean;
  lastMove: number;
  time: number;
}

export interface IPlayer {
  time: number;
  name: string;
  board: IBoard;
  start: boolean;
}

export interface IBoard {
  [key: string]: {
    value: number;
    name: string;
  }
}

export interface IGameStates {
  [key: string]: IRoom
}

export interface IGame {
  player1_state: IBoard;
  player2_state: IBoard;
  player1: string;
  player2: string;
  ongoing: boolean;
}
