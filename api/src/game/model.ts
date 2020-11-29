export const startGame = (
  gameStates: any,
  roomName: string,
  connections: string[]
): void => {
  const arr = connections.slice();

  gameStates[roomName] = {
    playerList: arr,
    p1: {
      name: arr[0],
      board: null
    },
    p2: {
      name: arr[1],
      board: null
    },
    turn: arr[0],
    start: false,
    time: null
  };

  //const data = [ roomName, arr ];
  //sendToDatabase(data);
};
