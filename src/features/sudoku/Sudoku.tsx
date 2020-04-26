import React, { useState, useEffect } from "react";
import cn from "classnames";
import { useSelector, useDispatch } from "react-redux";

import {
  // rowCount,
  // columnCount,
  cellData,
  initializeBoard,
  setPencilMark,
  clearPencilMark,
  setFinalNumber,
  clearFinalNumber,
  validateConstraint,
  invalidCells,
} from "./sudokuSlice";
import { useKeyDown } from "../hooks/useKeyPress";

import styles from "./Sudoku.module.css";
import { SudokuSetupPanel } from "./SudokuSetupPanel";

interface CellIndex {
  row?: number;
  column?: number;
}

export function Sudoku() {
  // const row = useSelector(rowCount);
  // const column = useSelector(columnCount);
  const data = useSelector(cellData);
  const invalid = useSelector(invalidCells);

  const dispatch = useDispatch();

  const [selectedIndexes, setSelectedIndexes] = useState<CellIndex>({
    row: undefined,
    column: undefined,
  });

  const [isSetPencilMark, setIsSetPencilMark] = useState(false);

  useEffect(() => {
    dispatch(initializeBoard({ row: 9, column: 9 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useKeyDown(({ key, keyCode }) => {
    if (
      selectedIndexes.row !== undefined &&
      selectedIndexes.column !== undefined
    ) {
      // console.log(
      //   "keyDown",
      //   key,
      //   "cell",
      //   selectedIndexes.row,
      //   selectedIndexes.column
      // );

      if (keyCode > 48 && keyCode < 58) {
        dispatch(
          isSetPencilMark
            ? setPencilMark({
                row: selectedIndexes.row,
                column: selectedIndexes.column,
                number: +key,
              })
            : setFinalNumber({
                row: selectedIndexes.row,
                column: selectedIndexes.column,
                number: +key,
              })
        );
      } else if (keyCode === 8) {
        dispatch(
          isSetPencilMark
            ? clearPencilMark({
                row: selectedIndexes.row,
                column: selectedIndexes.column,
              })
            : clearFinalNumber({
                row: selectedIndexes.row,
                column: selectedIndexes.column,
              })
        );
      }
    }
  });

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() => setIsSetPencilMark((x) => !x)}
        >
          {isSetPencilMark ? "Set Pencil Mark" : "Set Final"}
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(validateConstraint())}
        >
          Validate
        </button>
      </div>
      {data.map((r, rowIndex) => (
        <div className={styles.row} key={`row${rowIndex}`}>
          {r.map((c, columnIndex) => (
            <div
              className={cn(styles.cell, {
                [styles.selectedCell]:
                  rowIndex === selectedIndexes.row &&
                  columnIndex === selectedIndexes.column,
                [styles.invalidCell]: invalid.some(
                  (x) => rowIndex === x.row && columnIndex === x.column
                ),
              })}
              onClick={() =>
                setSelectedIndexes({ row: rowIndex, column: columnIndex })
              }
              key={`c${columnIndex}r${rowIndex}`}
            >
              <div className={styles.pencilMarks}>
                {c.pencilMarks.slice().sort().join(" ")}
              </div>
              <div>{c.confirmed}</div>
            </div>
          ))}
        </div>
      ))}
      <SudokuSetupPanel />
    </div>
  );
}
