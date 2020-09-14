import produce from 'immer';
import React, { useCallback, useEffect, useState } from 'react';

const numRows = 30;
const numCols = 71;

const operations = [
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [1, 0],
  [-1, 0],
  [-1, -1],
  [-1, 1]
]

const App = () => {
  const toggleSquare = (grid, i, k) => {
    const newGrid = produce(grid, gridCopy => {
      gridCopy[i][k] = !gridCopy[i][k];
    })
    setGrid(newGrid);
  }
  const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array(numCols).fill(0))
    }
    return rows;
  }

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid()
  });

  const [running, setRunning] = useState(false);

  const runSimulation = useCallback(() => {
    if (!running) {
      return;
    }
    setGrid((g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            })
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      })
    }))
  }, [running])

  useEffect(() => {
    const simInterval = setInterval(runSimulation, 300)
    return () => {
      clearInterval(simInterval)
    }
  }, [runSimulation]);

  return (
    <>
      <button onClick={() => setRunning(!running)}>
        {running ? 'stop' : 'start'}
      </button>
      <button onClick={() => setGrid(generateEmptyGrid)}>
        clear
      </button>
      <button onClick={() => {
        setGrid(() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(Array.from(Array(numCols), () => Math.random() > 0.8 ? 1 : 0));
          }
          return rows;
        })
      }}>
        random
      </button>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) =>
            <div
              key={`${i} - ${k}`}
              onClick={() => toggleSquare(grid, i, k)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "1px solid black"
              }}
            />))}
      </div>
    </>
  );
};

export default App;
