import {
  checkFirstMove,
  checkIdxInBoard,
  checkEmpty,
  checkColor
} from "./move";
// check pawn's available move
const pawn = (r, c, board, color, player) => {
  const availableMoves = [];

  // check is pawn's move first move
  const isFirstMove = checkFirstMove(board, r, c);
  let count;
  if (isFirstMove) {
    count = 2;
  } else {
    count = 1;
  }

  // push available moves
  for (let i = 1; i <= count; i++) {
    // move of piece is depend on the color
    if (player === color) {
      var nr = r - i;
    } else {
      nr = r + i;
    }

    // check available moves

    if (checkIdxInBoard(nr, c) && checkEmpty(nr, c, board)) {
      availableMoves.push([nr, c]);
    }
    if (!checkIdxInBoard(nr, c) || !checkEmpty(nr, c, board)) {
      break;
    }
  }

  // check diagonal move
  if (player === color) {
    var newR = r - 1;
  } else {
    newR = r + 1;
  }

  var newC1 = c - 1;
  var newC2 = c + 1;
  const diagonal = [
    [newR, newC1],
    [newR, newC2]
  ];
  for (let i = 0; i < 2; i++) {
    const checkPoint = diagonal[i];
    const nr = checkPoint[0];
    const nc = checkPoint[1];
    if (checkIdxInBoard(nr, nc)) {
      // pawn can only move when board is filled with enemy piece
      if (!checkEmpty(nr, nc, board) && checkColor(nr, nc, board) !== color) {
        availableMoves.push([nr, nc]);
      }
    }
  }

  return availableMoves;
};

export default pawn;
