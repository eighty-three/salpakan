export type TPlayer = 'p1' | 'p2';
type TPlayers = { [K in TPlayer]: IPlayer };

type Column = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';
type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type TCoordinate = `${Column}${Row}`;

export interface ICount {
  list: string[];
  lastPublished: number;
}

interface ISpectators {
  [key: string]: TPlayer;
}

export interface IRoom extends TPlayers {
  playerList: string[];
  spectators: ISpectators
  board: IBoard;
  turn: TPlayer;
  start: boolean;
  lastMove: number;
  time: number;
  winner: string | null;
  connections: ICount;
  flagOnLastRow?: string;
  bot: boolean;
  positionHistory: string[];
}

export interface IPlayer {
  time: number;
  name: string;
  board: IBoard;
  start: boolean;
  pin: string|null;
}

export type IBoard = {
  [K in TCoordinate]?: {
    name: string;
    value?: number; // Value is optional because when the board is "cleaned", only the name remains (i.e., 'unknown') because you shouldn't know the value of your opponent's pieces
    owner?: 'loser' | 'p1' | 'p2'; // To differentiate between pieces
  }
}

export interface IGameStates {
  [key: string]: IRoom
}

export interface IGame {
  winner_board: IBoard;
  loser_board: IBoard;
  player1: string;
  player2: string;
  ongoing: boolean;
  winner: string;
  position_history: string[];
}

export interface IName {
  name: string;
}
