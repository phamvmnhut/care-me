import React from "react";

import Square from "./Square";

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

export default Board;
