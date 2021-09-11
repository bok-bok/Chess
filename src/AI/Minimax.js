import { makeMove } from "../move/move";
import { getAllMoves } from "./AI";

const minimaxRoot = (
  depth,
  board,
  previousBoard,
  AIColorNum,
  player,
  turnColorNum,
  changeTitle
) => {
  let newTurnColorNum;
  turnColorNum === 1 ? (newTurnColorNum = 0) : (newTurnColorNum = 1);
  // get player of this turn's all moves
  const allMoves = getAllMoves(board, previousBoard, turnColorNum);
  shuffle(allMoves);
  // loop all moves
  let bestScore = -9999;
  let bestMove;

  for (let piece of allMoves) {
    const row = piece[0];
    const col = piece[1];
    const moves = piece[2];

    // if piece cannot move make new move
    if (moves === undefined || moves.length === 0) {
      continue;
    } else {
      let newBoard;
      // loop all move of a piece

      for (let move of moves) {
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

        let tempScore = minimax(
          depth - 1,
          newBoard,
          board,
          AIColorNum,
          player,
          newTurnColorNum,
          changeTitle
        );
        console.log(tempScore);
        if (tempScore > bestScore) {
          console.log("Updated best Score: " + tempScore);
          bestScore = tempScore;
          bestMove = newBoard;
        }
      }
    }
  }

  return bestMove;
};

const minimax = (
  depth,
  board,
  previousBoard,
  AIColorNum,
  player,
  turnColorNum,
  changeTitle
) => {
  console.log("minimax's depth: " + depth);
  // update turn Color
  let newTurnColorNum;
  turnColorNum === 1 ? (newTurnColorNum = 0) : (newTurnColorNum = 1);

  // return board score when it reaches the end
  if (depth === 0) {
    const score = evaluateBoard(board, AIColorNum);

    return score;
  }

  // get player of this turn's all moves
  const allMoves = getAllMoves(board, previousBoard, turnColorNum);

  // it is checkMate if no availableMove for all piece
  let checkMate = true;
  for (let piece of allMoves) {
    const move = piece[2];
    if (move !== undefined && move.length !== 0) {
      checkMate = false;
      break;
    }
  }
  if (checkMate) {
    changeTitle("CheckMate! " + player + " win", "red", false);
  }

  // loop all moves
  for (let piece of allMoves) {
    const row = piece[0];
    const col = piece[1];
    const moves = piece[2];
    // if piece cannot move make new move
    if (moves === undefined || moves.length === 0) {
      continue;
    } else {
      let newBoard;
      // loop all move of a piece

      let bestScore;
      if (AIColorNum === turnColorNum) {
        // when AI's turn score should be maximized
        bestScore = -9999;
        for (let move of moves) {
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

          bestScore = Math.max(
            minimax(
              depth - 1,
              newBoard,
              board,
              AIColorNum,
              player,
              newTurnColorNum,
              changeTitle
            )
          );
        }
      } else {
        // player's turn score should be minimized
        bestScore = 9999;
        for (let move of moves) {
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

          bestScore = Math.min(
            minimax(
              depth - 1,
              newBoard,
              board,
              AIColorNum,
              player,
              newTurnColorNum,
              changeTitle
            )
          );
        }
      }
      return bestScore;
    }
  }
};

const evaluateBoard = (board, AIColorNum) => {
  //loop to evaluate

  let score = 0;
  for (let row of board) {
    for (let element of row) {
      score = score + evaluatePiece(element, AIColorNum);
    }
  }

  return score;
};

const evaluatePiece = (piece, AIColorNum) => {
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

  if (AIColorNum === color) {
    return score;
  } else {
    return -score;
  }
};

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }

  return array;
}

export default minimaxRoot;
