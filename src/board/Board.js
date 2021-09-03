import "./Board.css";
import React from "react";
import checkAvailable from "../move/move";
import Pieces from "../pieces/Pieces";
import board from "../assets/initialBoard";
//import rules from "../rules/rules";
import { makeMove } from "../move/move";
class Board extends React.Component {
  constructor() {
    super();
    this.state = {
      previousBoard: board,
      turn: "white",
      board: board,
      player: "black",
      availableMoves: [],
      currentRowCol: [],
      title: "white's turn",
      gameStatus: true,
      whiteCatched: [],
      blackCatched: []
    };
  }

  BOARDLEN = 8;

  // get row and col value of piece
  pieceClickedHandler = (r, c, isAvailable) => {
    let turn = this.state.turn;
    // get current col and row
    const curRowCol = this.state.currentRowCol;
    console.log("clicked-----------------------------------------");
    // if current row and col are exist get

    if (curRowCol.length !== 0) {
      var curRow = curRowCol[0];
      var curCol = curRowCol[1];
    } else {
      // when it is new move
      // check player is following the right turn
      if (!this.checkTurn(r, c, turn)) {
        return;
      }

      // update curRowCol if it is right turn

      const available = checkAvailable(
        r,
        c,
        this.state.board,
        this.state.previousBoard,
        this.state.player,
        "main"
      );

      this.setState({ currentRowCol: [r, c], availableMoves: available });
      return;
    }

    // make new available move when player decided clicked not available spot
    if (!isAvailable) {
      if (!this.checkTurn(r, c, turn)) {
        return;
      }
      const available = checkAvailable(
        r,
        c,
        this.state.board,
        this.state.previousBoard,
        this.state.player,
        "main"
      );
      this.setState({ availableMoves: available, currentRowCol: [r, c] });
    } else {
      // make a move and update
      let title = this.state.title;

      turn === "black" ? (turn = "white") : (turn = "black");
      title = turn + "'s turn";

      this.setState({ title: title });
      this.setState({ previousBoard: this.state.board });
      this.setState({
        board: makeMove(
          r,
          c,
          curRow,
          curCol,
          this.state.board,
          this.state.player,
          "main",
          this.changeTitle,
          this.updateBoard
        ),
        availableMoves: [],
        turn: turn,
        currentRowCol: []
      });
    }
  };

  changeTitle = (color) => {
    const title = "checkmate! " + color + " win!";

    this.setState({ title: title, gameStatus: false });
  };

  checkTurn = (r, c, turn) => {
    const piece = this.state.board[r][c];
    if (piece !== 0) {
      const color = piece[1] === 1 ? "white" : "black";
      if (color !== turn) {
        // just return it if it is wrong turn
        console.log("it is not " + color + "'s turn");
        return false;
      }
    }
    return true;
  };

  // copy board
  copyBoard = () => {
    const copyBoard = [...this.state.board];
    return copyBoard;
  };
  //check row and col is in available move
  checkRowColInAvailableMoves(row, col) {
    if (!this.state.availableMoves) {
      return false;
    }
    for (let move = 0; move < this.state.availableMoves.length; move++) {
      const r = this.state.availableMoves[move][0];
      const c = this.state.availableMoves[move][1];
      if (row === r && col === c) {
        return true;
      }
    }
    return false;
  }

  // function that render a board
  renderBoard = () => {
    return this.state.board.map((row, r) =>
      row.map((element, c) => (
        <Pieces
          clicked={() =>
            this.pieceClickedHandler(
              r,
              c,
              this.checkRowColInAvailableMoves(r, c)
            )
          }
          key={(r, c)}
          row={r}
          col={c}
          colorKind={this.state.board[r][c]}
          available={this.checkRowColInAvailableMoves(r, c)}
        />
      ))
    );
  };

  render() {
    const title = this.state.title;
    //console.log(title);
    return (
      <div>
        <head>
          <title>Online Chess</title>
        </head>
        <body className="header">
          <h1>Online Chess</h1>
          <p>{title}</p>
          <div className="game">
            <div className="wrapper">{this.renderBoard()}</div>
          </div>
        </body>
        <footer>
          <p className="footer">
            {" "}
            &#169;2021. Kyungbok Lee. ALL RIGHT RESERVED.
          </p>
        </footer>
      </div>
    );
  }
}

export default Board;
