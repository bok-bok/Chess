import { makeMove } from "../move/move";
import { getAllMoves } from "./AI";
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

const evaluateBoard = (board, turnNum) => {
  //loop to evaluate
  let score;
  for (let row of board) {
    for (let element of row) {
      score = score + evaluatePiece(element, turnNum);
    }
  }
  return score;
};

const evaluatePiece = (piece, turnNum) => {
  if (piece === 0) {
    return 0;
  }
  const element = piece[0];
  const color = piece[1];
  const evaluatePieceHelper = (element) => {
    if (element === 1) {
      // pawn
      return 10;
    } else if (element === 2) {
      // bishop
      return 30;
    } else if (element === 3) {
      //kight
      return 30;
    } else if (element === 4) {
      //rook
      return 50;
    } else if (element === 5) {
      //queen
      return 90;
    } else if (element === 6) {
      return 900;
    }
  };
  let score = evaluatePieceHelper(element);

  if (turnNum === color) {
    return score;
  } else {
    return -score;
  }
};

export default minimax;
