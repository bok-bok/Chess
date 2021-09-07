import { makeMove } from "../move/move";
import { getAllMoves } from "./AI";

const randomMoveAI = (board, previousBoard, AIColor, player, changeTitle) => {
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

  // make random move function
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

export default randomMoveAI;
