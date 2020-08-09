import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

interface SquareProps {
  value: boolean
  highlighted: boolean
  onClick: () => void
}

interface BoardProps {
  x: number
  y: number
  winCondition: number
  end: (winner: boolean) => void
}

class Point {
  get y(): number {
    return this._y
  }

  get x(): number {
    return this._x
  }

  constructor(x: number, y: number) {
    this._x = x
    this._y = y
  }

  private readonly _x!: number
  private readonly _y!: number
}

interface BoardState {
  squares: boolean[][]
  xIsNext: boolean
  winTemplate: Point[][]
  winPos: any
  winPoints: Point[]
}

function Square(props: SquareProps) {
  return (
    <span className={'square' + (props.value !== undefined ? ' occupied' : '') + (props.highlighted ? ' highlight' : '')}
          onClick={props.onClick}>
      {props.value == null ? '' : props.value ? '⚫' : '⚪'}
    </span>
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
      xIsNext: true,
      winTemplate: function () {
        const opsTemplate = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
        const winTemplate: Point[][] = []

        for (let i = 0; i < 3; i++) {
          const ops = opsTemplate[i]
          const template = []
          for (let j = 0; j < props.winCondition; j++) {
            template.push(new Point(ops.x * j, ops.y * j))
          }
          winTemplate.push(template)
        }

        for (let i = 0; i < 3; i++) {
          const template = winTemplate[i].slice()
          const ops = opsTemplate[i]
          for (let j = 1; j < props.winCondition; j++) {
            const newTemplate = []
            for (let k = 0; k < template.length; k++) {
              newTemplate.push(new Point(template[k].x - ops.x * j, template[k].y - ops.y * j))
            }

            winTemplate.push(newTemplate)
          }

        }
        return winTemplate
      }(),
      winPos: null,
      winPoints: []
    }
  }

  handleClick(x: number, y: number) {
    if (this.state.squares[x][y] !== undefined) {
      return
    }

    const squares = this.state.squares.slice()
    squares[x][y] = this.state.xIsNext
    this.setState({ squares: squares, xIsNext: !this.state.xIsNext })
    this.calculateWinner(x, y)
  }

  calculateWinner(x: number, y: number) {
    const thisValue = this.state.squares[x][y]
    let winPos: Point[] = []
    const templates = this.state.winTemplate.filter(temps => temps.every(item =>
      x + item.x >= 0 && x + item.x < this.props.x && y + item.y >= 0 && y + item.y < this.props.y
    ))
    for (const temp of templates) {
      const matched = temp.every((item) => this.state.squares[x + item.x][y + item.y] === thisValue)
      if (matched) {
        winPos = temp
        break
      }
    }

    if (winPos.length > 0) {
      // win
      this.end(x, y, thisValue, winPos)
    }

  }

  end(x: number, y: number, winner: boolean, winPos: Point[]) {
    this.setState({ winPos: { x, y }, winPoints: winPos })
    this.props.end(winner)
  }

  highlighted(x: number, y: number) {
    if (this.state.winPos == null) {
      return false
    }
    return this.state.winPoints.some(item => item.x + this.state.winPos.x === x && item.y + this.state.winPos.y === y)
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? '⚫' : '⚪')

    return (
      <div>
        <div className="status">{status}</div>
        {
          this.state.squares.map((itemX, x) =>
            <div key={x} className="board-row">
              {
                this.state.squares.map((itemY, y) =>
                  <Square key={x + ',' + y}
                          value={this.state.squares[x][y]}
                          onClick={() => this.handleClick(x, y)}
                          highlighted={this.highlighted(x, y)} />
                )
              }
            </div>
          )
        }</div>
    )
  }
}

interface GameState {
  ended: boolean
  winner: boolean
}

class Game extends React.Component<{}, GameState> {
  constructor(props: any) {
    super(props)
    this.state = {
      ended: false,
      winner: false
    }
  }

  render() {
    return (
      <div className="game">
        <div className={this.state.ended ? 'game-end' : 'game-playing'}>
          <div className="game-info">
            <span>Winner is {this.state.winner ? '⚫' : '⚪'}</span>
          </div>
        </div>
        <div className="game-board">
          <Board x={10} y={10} winCondition={5} end={(winner) => this.endGame(winner)} />
        </div>
      </div>
    )
  }

  endGame(winner: boolean) {
    this.setState({ ended: true, winner })
  }

}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
