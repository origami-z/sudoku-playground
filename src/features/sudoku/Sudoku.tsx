import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  // rowCount,
  // columnCount,
  cellData,
  initializeBoard,
} from "./sudokuSlice";

import styles from "./Sudoku.module.css";

export function Sudoku() {
  // const row = useSelector(rowCount);
  // const column = useSelector(columnCount);
  const data = useSelector(cellData);

  const dispatch = useDispatch();

  const [newRow, setNewRow] = useState(9);
  const [newColumn, setNewColumn] = useState(9);

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
      {data.map((r) => (
        <div className={styles.row}>
          {r.map((c) => (
            <div className={styles.cell}>{c.pencilMarks.join("")}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
