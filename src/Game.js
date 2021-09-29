import React, { useState, useEffect } from "react";
import "./App.css"

function Square({ x, y, value, onClick, winnerCells }) {
  const onSquareClick = () => { onClick(x, y); };

  // set style normal or won
  let style = "square"
  winnerCells.forEach(element => {
    if(element[0] === x && element[1] === y){ style = "square won" }
  });

  return (
    <div
      className={style}
      onClick={onSquareClick}
    >
      {value}
    </div>
  );
};

function Board({ square, winnerCells, onClick }) {
  return (
    <div className="board-row">
      {Array.from(Array(square.length).keys()).map((row) =>
        <div >
          {Array.from(Array(square[0].length).keys()).map((col) => 
          <Square 
            x={row}
            y={col}
            value={square[row][col] === 0 ? "" : square[row][col]} 
            onClick={(x, y) => onClick(x, y)} 
            winnerCells={winnerCells} />
          )}
        </div>)
      }
    </div>
  );
};

function Setting({ isPlaying, onAcceptClick, ascending, setAscending}) {
  const [row, setRow] = useState(10);
  const [col, setCol] = useState(10);
  const [err, setErr] = useState(""); 
  function onAcceptClickSetting() {
    if (isPlaying) return;
    if (row < 5) { return setErr("Số hàng phải lớn hơn 5") }
    if (col < 5) { return setErr("Số cột phải lớn hơn 5") }
    onAcceptClick(row, col);
    setErr("")
  }
  return (
    <div className="game-setting">
      <p className="game-setting__title">Cấu hình game</p>
      <input type="number" min="5" placeholder="Nhập Số hàng" className="input_form"
        value={row}
        disabled = {isPlaying}
        onChange={(e) => setRow(parseInt(e.target.value))}
      ></input>
      <input type="number" min="5" placeholder="Nhập Số cột" className="input_form"
        value={col}
        name="col"
        disabled = {isPlaying}
        onChange={(e) => setCol(parseInt(e.target.value))}
      ></input>
      {err && <p>{err}</p>}
      <button onClick={onAcceptClickSetting} className="btn" >Thay đổi</button>
      <button onClick={()=>{ setAscending(!ascending); }} className="btn" >
        {ascending ? "Xếp trên xuống" : "Xếp dưới lên"}
      </button>
    </div>
  )
}

function Game() {
  const [xy, setXY] = useState({x: 10, y: 10}); // kích thước mảng
  const [isPlaying, setIsPlaying] = useState(false); // đang chơi game
  const [ascending, setAscending] = useState(false); // là đang xếp trên xuống

  const [isNext, setIsNext] = useState(true); // giá trị next tiếp là X hoặc O

  const [history, setHistory] = useState([
    {
      squares: Array(xy.x)
        .fill()
        .map(() => Array(xy.y).fill(0)),
      x: null,
      y: null,
    },
  ]);
  const [step, setStep] = useState(0); // bước số
  const [square, setSquare] = useState(history[step].squares); // mảng ô hiện tại hiển thị

  const [moves, setMoves] = useState([]); // di duyển lịch sử đến
  const [winnerCells, setWinnerCells] = useState([]); // các ô thắng
  const [contineuCell, setCntCell] = useState(0); // thứ tự ô kế tiếp

  function onSquareClick(x, y) {
    if (winnerCells.length === 5) return;
    if (!isPlaying) setIsPlaying(true);

    const newHistory = history.slice(0, step + 1);
    const current = newHistory[newHistory.length - 1];
    const squares = JSON.parse(JSON.stringify(current.squares)); // array 2d not working with slice()

    if (squares[x][y] !== 0) return;

    setCntCell(contineuCell + 1);
    squares[x][y] = isNext ? "X" : "O";
    const _winnerCells = checkWin(x, y, squares[x][y]);
    if (_winnerCells) {
      setWinnerCells(_winnerCells);
    }

    const _history = newHistory.concat([
      {
        squares,
        x,
        y,
      },
    ]);

    setSquare(squares);

    setHistory(_history);
    setStep(step + 1);
    setIsNext(!isNext);
  };

  function jumpTo(move) {
    setSquare(history[move].squares);
    setStep(move);
    setIsNext(move % 2 === 0);
  };

  function reStart(move) {
    jumpTo(move);
    setWinnerCells([]);
  };

  useEffect(() => {
    const _moves = history.map((_, move) => {
      if (ascending) { move = history.length - 1 - move; }

      const desc = move
        ? `Go to move #${move}: (${history[move].x}, ${history[move].y})`
        : "Go to game start";
        if (!move) {
          return (
            <li key={move}>
              <button onClick={() => reStart(move)}>
                {step ? desc : <b> {desc} </b>}
              </button>
            </li>
          );
        }
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>
              {move === step ? <b> {desc} </b> : desc}
            </button>
          </li>
        );
    });

    setMoves(_moves);
  }, [step, ascending]);

  const status = contineuCell === xy.x * xy.y
      ? "Huề"
      : winnerCells.length === 5
      ? "Người thắng: " + square[winnerCells[0][0]][winnerCells[0][1]]
      : "Lượt kế tiếp: " + (isNext ? "X" : "O");

  function onAcceptClick(row, col) {
    const history_ = [
      {
        squares: Array(parseInt(row))
          .fill()
          .map(() => Array(parseInt(col)).fill(0)),
        x: null,
        y: null,
      },
    ];
    setXY({x: parseInt(row), y: parseInt(col)})
    setSquare(history_[0].squares);
    setHistory(history_);
  };

  function checkWin(x, y, currentVal) {
    const current = history[step];
    const squares = current.squares.slice();
    let winCells = [];

    let coorX = x;
    let coorY = y;
    winCells.push([x, y]);

    // check col
    let cntInCol = 1;
    coorX = x - 1;
    while (coorX >= 0 && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntInCol++;
      coorX--;
    }

    coorX = x + 1;
    while (coorX < xy.x && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntInCol++;
      coorX++;
    }
    if (cntInCol >= 5) {
      return winCells;
    }

    // check row
    winCells = [];
    winCells.push([x, y]);
    let cntInRow = 1;
    coorX = x;
    coorY = y - 1;
    while (coorY >= 0 && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntInRow++;
      coorY--;
    }

    coorY = y + 1;
    while (coorX < xy.y && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntInRow++;
      coorY++;
    }
    if (cntInRow >= 5) {
      return winCells;
    }

    // check main diagonal
    winCells = [];
    winCells.push([x, y]);
    let cntMainDiagonal = 1;
    coorY = y - 1;
    coorX = x - 1;
    while (coorY >= 0 && coorX >= 0 && squares[coorX][coorY] === currentVal) {
      winCells.push([coorX, coorY]);
      cntMainDiagonal++;
      coorY--;
      coorX--;
    }

    coorX = x + 1;
    coorY = y + 1;
    while (coorX < xy.x && coorY < xy.y && squares[coorX][coorY] === currentVal) {
      cntMainDiagonal++;
      winCells.push([coorX, coorY]);
      coorX++;
      coorY++;
    }
    if (cntMainDiagonal >= 5) {
      return winCells;
    }

    // check skew diagonal
    winCells = [];
    winCells.push([x, y]);
    let cntSkewDiagonal = 1;
    coorX = x - 1;
    coorY = y + 1;
    while (coorY < xy.y && coorX >= 0 && squares[coorX][coorY] === currentVal) {
      cntSkewDiagonal++;
      winCells.push([coorX, coorY]);
      coorY++;
      coorX--;
    }

    coorX = x + 1;
    coorY = y - 1;
    while (coorX < xy.x && coorY >= 0 && squares[coorX][coorY] === currentVal) {
      cntSkewDiagonal++;
      winCells.push([coorX, coorY]);
      coorX++;
      coorY--;
    }
    if (cntSkewDiagonal >= 5) {
      return winCells;
    }

    return false;
  };

  return (
    <div className="game">
      <Board
        square={square}
        size={xy}
        winnerCells={winnerCells}
        onClick={(x, y) => { onSquareClick(x, y); }}
      />

      <div className="game-info">
        <Setting 
          isPlaying = {isPlaying}
          onAcceptClick = {onAcceptClick} 
          ascending ={ascending}
          setAscending={setAscending}
        /> 
  
        <div className="game-status">
          <p className="game-status__title">{status}</p>
          <div>{moves}</div>
        </div>
        
      </div>
    </div>
  );
}

export default Game;
