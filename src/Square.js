import React from "react";

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

export default Square;
