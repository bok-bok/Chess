import "./Board.css";
import React from "react";
import checkAvailable from "../move/move";
import Pieces from "../pieces/Pieces";
import board from "../assets/initialBoard";
import Minimax from "../AI/Minimax";
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
      blackCatched: [],
      AImode: false
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

  // make new game
  newGame() {
    let newBoard;
    const player = this.state.player;
    if (player === "white") {
      newBoard = this.rotateBoard(board);
    } else {
      newBoard = board;
    }
    this.setState({
      previousBoard: newBoard,
      turn: "white",
      board: newBoard,
      player: player,
      availableMoves: [],
      currentRowCol: [],
      title: player + "'s turn",
      gameStatus: true,
      whiteCatched: [],
      blackCatched: []
    });
  }

  //rotate board
  rotateBoard(board) {
    let ret = [...Array(8)].map((e) => Array(8));
    for (let i = 0; i < board.length; ++i) {
      for (let j = 0; j < board.length; ++j) {
        ret[i][board.length - 1 - j] = board[board.length - 1 - i][j];
      }
    }

    return ret;
  }
  // change player
  changePlayer(e) {
    const playerToChange = e.target.innerText.toLowerCase();
    if (playerToChange === this.state.player) {
      alert("nothing to change");
      return;
    }
    let newBoard;
    if (playerToChange === "white") {
      newBoard = this.rotateBoard(board);
    } else {
      newBoard = board;
    }

    const player = this.state.player;
    this.setState({
      previousBoard: newBoard,
      turn: "white",
      board: newBoard,
      player: playerToChange,
      availableMoves: [],
      currentRowCol: [],
      title: player + "'s turn",
      gameStatus: true,
      whiteCatched: [],
      blackCatched: []
    });
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

  AITurn = () => {
    let nextTurn;
    this.state.turn === "white" ? (nextTurn = "black") : (nextTurn = "white");
    const newBoard = Minimax(
      this.state.board,
      this.state.previousBoard,
      this.state.turn,
      this.state.player,
      this.changeTitle
    );

    this.setState({ previousBoard: this.state.board });
    this.setState({
      board: newBoard,
      turn: nextTurn,
      title: nextTurn + "'s turn"
    });
  };

  AImodeButtonClicked = () => {
    this.setState({ AImode: !this.state.AImode });
  };

  render() {
    const title = this.state.title;
    if (this.state.player !== this.state.turn && this.state.AImode) {
      this.AITurn();
    }
    let AIButtonTitle;
    this.state.AImode
      ? (AIButtonTitle = "Normal Mode")
      : (AIButtonTitle = "AI Mode");
    console.log(AIButtonTitle);
    return (
      <html>
        <body className="header">
          <h1>Chess</h1>
          <p>{title}</p>
          <div className="game">
            <div className="ai">
              <p>AI</p>
            </div>
            <div className="wrapper">{this.renderBoard()}</div>
            <div className="player">
              <p>Player</p>
            </div>
          </div>
          <div className="buttons">
            <button onClick={(e) => this.changePlayer(e)}>White</button>
            <button onClick={(e) => this.changePlayer(e)}>Black</button>
            <button onClick={() => this.newGame()}>New Game</button>
            <button onClick={() => this.AImodeButtonClicked()}>
              {AIButtonTitle}
            </button>
          </div>
          <footer>
            <p className="footer">
              {" "}
              &#169;2021. Kyungbok Lee. ALL RIGHT RESERVED.
            </p>
          </footer>
        </body>
      </html>
    );
  }
}

export default Board;
