import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Debugger } from 'inspector'

interface SquareProps {
  value: boolean
  onClick: () => void
}

interface BoardProps {
  x: number,
  y: number
}

interface BoardState {
  squares: boolean[][],
  xIsNext: boolean
}

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value == null ? '' : props.value ? '⚫' : '⚪'}
    </button>
  )
}

class Board extends React.Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props)
    this.state = {
      squares: function () {
        const squares: boolean[][] = new Array(props.x)
        for (let x = 0; x < props.x; x++) {
          squares[x] = new Array(props.y)
        }
        return squares
      }(),
      xIsNext: true
    }
  }

  renderSquare(x: number, y: number) {
    return <Square value={this.state.squares[x][y]} onClick={() => this.handleClick(x, y)} />
  }

  handleClick(x: number, y: number) {
    const squares = this.state.squares.slice()
    squares[x][y] = this.state.xIsNext
    this.setState({ squares: squares, xIsNext: !this.state.xIsNext })
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? '⚫' : '⚪')

    return (
      <div>
        <div className="status">{status}</div>
        {

          this.state.squares.forEach((itemX, x) => {
            return <div className="board-row">{
              itemX.forEach((itemY, y) =>
                this.renderSquare(x, y)
              )
            })</div>
          })
        }
      </div>
    )
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board x={5} y={5} />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
