export interface IRoom {
  playerList: string[];
  p1: IPlayer;
  p2: IPlayer;
  board: IBoard;
  turn: string;
  start: boolean;
  lastMove: number;
  lastClosed: number;
  time: number;
}

export interface IPlayer {
  name: string;
  board: IBoard;
  time: number;
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
