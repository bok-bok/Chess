import checkAvailable from "../move/move";

export const getAllMoves = (board, previousBoard, AIColor, player) => {
  const allMoves = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      const piece = board[row][col];
      if (piece[1] === AIColor) {
        const moves = checkAvailable(
          row,
          col,
          board,
          previousBoard,
          player,
          "main"
        );
        allMoves.push([row, col, moves]);
      }
    }
  }
  return allMoves;
};
