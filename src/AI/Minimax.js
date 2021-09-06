import checkAvailable, { makeMove } from "../move/move";

const minimax = (board, previousBoard, AIColor, player, changeTitle) => {
  let AIColorNum;
  AIColor === "white" ? (AIColorNum = 1) : (AIColorNum = 0);
  const allMovesOfEachPiece = getAllMoves(
    board,
    previousBoard,
    AIColorNum,
    player
  );

  const pieceNum = allMovesOfEachPiece.length;
  let newBoard;

  while (true) {
    const randomPiece = Math.floor(Math.random() * pieceNum);
    const piece = allMovesOfEachPiece[randomPiece];

    const row = piece[0];
    const col = piece[1];
    const moves = piece[2];
    if (moves.length === 0) {
      continue;
    } else {
      const randomMove = Math.floor(Math.random() * moves.length);
      const move = moves[randomMove];
      const targetRow = move[0];
      const targetCol = move[1];
      newBoard = makeMove(
        targetRow,
        targetCol,
        row,
        col,
        board,
        player,
        "main",
        changeTitle
      );
    }

    break;
  }

  return newBoard;
};

const getAllMoves = (board, previousBoard, AIColor, player) => {
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

export default minimax;
