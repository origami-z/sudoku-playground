import React, { useState } from "react";
import cn from 'classnames';
import { useSelector, useDispatch } from "react-redux";

import {
  // rowCount,
  // columnCount,
  cellData,
  initializeBoard,
} from "./sudokuSlice";

import styles from "./Sudoku.module.css";

interface CellIndex {
  row?: number, column?: number
}

export function Sudoku() {
  // const row = useSelector(rowCount);
  // const column = useSelector(columnCount);
  const data = useSelector(cellData);

  const dispatch = useDispatch();

  const [newRow, setNewRow] = useState(9);
  const [newColumn, setNewColumn] = useState(9);

  const [selectedIndexes, setSelectedIndexes] = useState<CellIndex>({ row: undefined, column: undefined })

  return (
    <div>
      <div className={styles.row}>
        <input
          className={styles.textbox}
          aria-label="Set row number"
          value={newRow}
          onChange={(e) => setNewRow(Number.parseInt(e.target.value))}
          type="number"
        />
        <input
          className={styles.textbox}
          aria-label="Set column number"
          value={newColumn}
          onChange={(e) => setNewColumn(Number.parseInt(e.target.value))}
          type="number"
        />
        <button
          className={styles.button}
          onClick={() =>
            dispatch(initializeBoard({ row: newRow, column: newColumn }))
          }
        >
          Initialize
        </button>
      </div>
      {data.map((r, rowIndex) => (
        <div className={styles.row}>
          {r.map((c, columnIndex) => (
            <div className={cn(styles.cell, {
              [styles.selectedCell]: rowIndex === selectedIndexes.row && columnIndex === selectedIndexes.column
            })}
              onClick={() => setSelectedIndexes({ row: rowIndex, column: columnIndex })}
            >{c.pencilMarks.join("")}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
