import React, { useState } from 'react';

const RushHour = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0],
    [2, 2, 0, 0, 0, 0],
    [0, 0, 0, 3, 0, 4],
    [0, 0, 0, 3, 0, 4],
    [0, 0, 0, 5, 5, 5]
  ]);
  const [draggingPiece, setDraggingPiece] = useState(null);
  const [startPosition, setStartPosition] = useState({ row: 0, col: 0 });

  const handleDragStart = (e, row, col) => {
    setDraggingPiece(board[row][col]);
    setStartPosition({ row, col });
  };

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDrop = (e, newRow, newCol) => {
    e.preventDefault();
    if (draggingPiece === null) return;
    movePiece(startPosition.row, startPosition.col, newRow, newCol);
    setDraggingPiece(null);
  };

  const movePiece = (startRow, startCol, newRow, newCol) => {
    const newBoard = [...board];
    const piece = newBoard[startRow][startCol];

    const horizontal = piece === 1 || piece === 4;
    const forward = piece === 1 || piece === 2 || piece === 5;

    if (horizontal && newRow === startRow && newCol !== startCol) {
      let i = startCol;
      while (i !== newCol) {
        if (newBoard[startRow][i + (forward ? 1 : -1)] !== 0) return;
        i += forward ? 1 : -1;
      }
    } else if (!horizontal && newCol === startCol && newRow !== startRow) {
      let i = startRow;
      while (i !== newRow) {
        if (newBoard[i + (forward ? 1 : -1)][startCol] !== 0) return;
        i += forward ? 1 : -1;
      }
    } else {
      return;
    }

    newBoard[startRow][startCol] = 0;
    newBoard[newRow][newCol] = piece;
    setBoard(newBoard);
  };

  return (
    <div className="rush-hour">
      <h1>Rush Hour</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell === 0 ? 'empty' : `car-${cell}`}`}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, rowIndex, colIndex)}
                draggable={cell !== 0}
                onDragStart={e => handleDragStart(e, rowIndex, colIndex)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RushHour;
