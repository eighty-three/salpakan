export type TPlayer = 'p1' | 'p2';
type TPlayers = { [K in TPlayer]: IPlayer };

export interface IRoom extends TPlayers {
  playerList: string[];
  board: IBoard;
  turn: string;
  start: boolean;
  lastMove: number;
  time: number;
  winner: string | null;
  flagOnLastRow?: string;
}

export interface IPlayer {
  time: number;
  name: string;
  board: IBoard;
  start: boolean;
}

export interface IBoard {
  [key: string]: {
    name: string;
    value?: number; // Value is optional because when the board is "cleaned", only the name remains (i.e., 'unknown') because you shouldn't know the value of your opponent's pieces
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
  winner: string;
}
