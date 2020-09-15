import produce from 'immer';
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';

const numRows = 30;
const numCols = 60;

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

const pulsar = [ // 15 x 15
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
  [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]
]

const pentadecathlon = [ // 7 x 16
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0]
]

const App = () => {
  const toggleSquare = (grid, i, k, mode) => {
    switch (mode) {
      case 'single': {
        console.log('i: ', i);
        console.log('k: ', k);
        const newGrid = produce(grid, gridCopy => {
          gridCopy[i][k] = !gridCopy[i][k];
        })
        setGrid(newGrid);
        break;
      }
      case 'penta': {
        if (i - 3 >= 0 && i + 3 < numRows && k - 7 >= 0 && k + 8 < numCols) { // check bounds
          console.log('bounds passed');
          const newGrid = produce(grid, gridCopy => {
            pentadecathlon.forEach((row, y) => row.forEach((cell, x) => {
              gridCopy[i - 3 + x][k - 7 + y] = cell;
            }))
          })
          setGrid(newGrid);
        }
        break;
      }
      case 'pulsar': {
        console.log('i: ', i);
        console.log('k: ', k);
        // center point of pulsar at row 7, pos 7
        if (i - 7 >= 0 && i + 7 < numRows && k - 7 >= 0 && k + 7 < numCols) { // check bounds
          console.log('bounds passed');
          const newGrid = produce(grid, gridCopy => {
            pulsar.forEach((row, y) => row.forEach((cell, x) => {
              gridCopy[i - 7 + x][k - 7 + y] = cell;
            }))
          })
          setGrid(newGrid);
        }
        break;
      }
      default:
        return;
    }
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

  const [mode, setMode] = useState('single');

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
    <div className="flex-container column">
      <div className="flex-container row">
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
      </div>
      <div className="flex-container">
        <div
          className="grid-container"
          style={{
            display: "inline-grid",
            gridTemplateColumns: `repeat(${numCols}, 20px)`
          }}>
          {grid.map((rows, i) =>
            rows.map((col, k) =>
              <div
                key={`${i} - ${k}`}
                onClick={() => toggleSquare(grid, i, k, mode)}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][k] ? "black" : undefined,
                  border: "1px solid black"
                }}
              />))}
        </div>
        <div className="title">
          Special Properties
          <div className="title special">
            Still Lifes
            <div className="flex-container column shrink">
              <button>Block</button>
              <button>Bee-hive</button>
              <button>Loaf</button>
              <button>Boat</button>
              <button>Tub</button>
            </div>
          </div>
          <div className="title special">
            Oscillators
            <div className="flex-container column shrink">
              <button>Blinker</button>
              <button>Toad</button>
              <button>Beacon</button>
              <button onClick={() => setMode('pulsar')}>Pulsar</button>
              <button onClick={() => setMode('penta')}>Penta-decathlon</button>
            </div>
          </div>
          <div className="title special">
            Spaceships
            <div className="flex-container column shrink">
              <button>Glider</button>
              <button>Lightweight</button>
              <button>Middleweight</button>
              <button>Heavyweight</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
