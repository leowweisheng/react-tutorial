import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className="square" 
      onClick={props.onClick} 
      style={{color: props.winningSquare ? "red" : "black"}}>
        {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningSquare = this.props.winningSquares 
      && this.props.winningSquares.includes(i);

    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        winningSquare={winningSquare} 
      />
    );
  }

  render() {
    let grid = [];
    let count = 0;

    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        row.push(<span key={count}>{this.renderSquare(count)}</span>)
        count += 1;
      }
      grid.push(<div className="board-row" key={i}>{row}</div>);
    }

    return (
      <div>
        {grid}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coord: Array(2).fill(0),
      }],
      xIsNext: true,
      stepNumber: 0,
      descOrder: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const coord = current.coord.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    if (i === 0 || i === 1 || i === 2) {
      coord[0] = 1;
    } else if (i === 3 || i === 4 || i === 5) {
      coord[0] = 2;
    } else {
      coord[0] = 3;
    }
    if (i === 0 || i === 3 || i === 6) {
      coord[1] = 1;
    } else if (i === 1 || i === 4 || i === 7) {
      coord[1] = 2;
    } else {
      coord[1] = 3;
    }

    this.setState({
      history: history.concat([{
        squares: squares, 
        coord: coord,
      }]),
      xIsNext: !this.state.xIsNext, 
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeOrder() {
    this.setState({
      descOrder: !this.state.descOrder,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const desc = move ?
        'Go to Move #' + move + ' (' + 
          history[move].coord[0] + ',' + history[move].coord[1] + ')' :
        'Go to Game Start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b> {desc} </b> : desc}
          </button>
        </li>
      );
    });
    
    moves = this.state.descOrder ? moves : moves.reverse()

    let status;
    if (winner) {
      status = <font color="red">{'Winner: ' + current.squares[winner[0]]}</font>;
    } else if (this.state.stepNumber < 9) {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    } else {
      status = <font color="red">{'It is a draw!'}</font>;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winningSquares={winner}
            squares={current.squares} 
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.changeOrder()}>
            {'Reverse Move Order'}
          </button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);