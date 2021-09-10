import { makeMove } from "../move/move";
import { randomMove, getAllMoves } from "./AI";

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
  // loop all moves
  let bestScore = -9999;
  let bestMove;
  for (let movesOfPiece of allMoves) {
    for (let piece of movesOfPiece) {
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
          console.log(newBoard);
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
            bestScore = tempScore;
            bestMove = newBoard;
          }
        }
      }
    }
  }
  console.log(bestScore);
  console.log(bestMove);
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
  console.log(depth);
  // update turn Color
  let newTurnColorNum;
  turnColorNum === 1 ? (newTurnColorNum = 0) : (newTurnColorNum = 1);

  // return board score when it reaches the end
  if (depth === 0) {
    console.log("hi");
    return evaluateBoard(board, AIColorNum);
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
  for (let movesOfPiece of allMoves) {
    for (let piece of movesOfPiece) {
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
  }
};

const evaluateBoard = (board, AIColorNum) => {
  //loop to evaluate
  let score;
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

export default minimaxRoot;
