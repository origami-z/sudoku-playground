import React, { useState } from "react";
import cn from "classnames";
import { useSelector, useDispatch } from "react-redux";

import {
  // rowCount,
  // columnCount,
  cellData,
  setPencilMark,
  clearPencilMark,
  setFinalNumber,
  clearFinalNumber,
  validateConstraint,
  invalidCells,
  CellIndex,
  clearInvalidCells,
} from "./sudokuSlice";
import { useKeyDown } from "../hooks/useKeyPress";

import styles from "./Sudoku.module.css";
import { SudokuSetupPanel } from "./SudokuSetupPanel";

export function Sudoku() {
  // const row = useSelector(rowCount);
  // const column = useSelector(columnCount);
  const data = useSelector(cellData);
  const invalid = useSelector(invalidCells);

  const dispatch = useDispatch();

  const [selectedIndexes, setSelectedIndexes] = useState<Array<CellIndex>>([]);

  const [isSetPencilMark, setIsSetPencilMark] = useState(false);

  // // Initialize the board on load
  // useEffect(() => {
  //   dispatch(initializeBoard({ row: 9, column: 9 }));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useKeyDown(({ key, keyCode }) => {
    // Temporarily only support one select cell
    if (selectedIndexes.length === 1) {
      // console.log(
      //   "keyDown",
      //   key,
      //   "cell",
      //   selectedIndexes.row,
      //   selectedIndexes.column
      // );

      const selectedIndex = selectedIndexes[0];

      if (keyCode > 48 && keyCode < 58) {
        dispatch(
          isSetPencilMark
            ? setPencilMark({
                row: selectedIndex.row,
                column: selectedIndex.column,
                number: +key,
              })
            : setFinalNumber({
                row: selectedIndex.row,
                column: selectedIndex.column,
                number: +key,
              })
        );
      } else if (keyCode === 8) {
        dispatch(
          isSetPencilMark
            ? clearPencilMark({
                row: selectedIndex.row,
                column: selectedIndex.column,
              })
            : clearFinalNumber({
                row: selectedIndex.row,
                column: selectedIndex.column,
              })
        );
      }
    } else if (selectedIndexes.length > 1) {
      console.warn("Keydown on multiple selected cell is not supported (yet).");
    }
  });

  function cellOnClick(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    rowIndex: number,
    columnIndex: number
  ) {
    // Command, Ctrl keys
    if (event.metaKey || event.ctrlKey) {
      setSelectedIndexes(
        Array.from(
          new Set(selectedIndexes).add({ row: rowIndex, column: columnIndex })
        )
      );
    } else if (event.shiftKey) {
      if (selectedIndexes.length === 0) {
        setSelectedIndexes([{ row: rowIndex, column: columnIndex }]);
      } else {
        // Approximate last one
        const lastSelected = selectedIndexes[selectedIndexes.length - 1];
        const rowFrom = Math.min(rowIndex, lastSelected.row);
        const rowTo = Math.max(rowIndex, lastSelected.row);
        const columnFrom = Math.min(columnIndex, lastSelected.column);
        const columnTo = Math.max(columnIndex, lastSelected.column);

        const existingSet = new Set(selectedIndexes);

        for (let i = rowFrom; i <= rowTo; i++) {
          for (let j = columnFrom; j <= columnTo; j++) {
            existingSet.add({ row: i, column: j });
          }
        }

        setSelectedIndexes(Array.from(existingSet));
      }
    } else {
      setSelectedIndexes([{ row: rowIndex, column: columnIndex }]);
    }
  }

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
        <button
          className={styles.button}
          onClick={() => {
            setSelectedIndexes([]);
            dispatch(clearInvalidCells());
          }}
        >
          Clear selection
        </button>
      </div>
      {data.map((r, rowIndex) => (
        <div className={styles.gridRow} key={`row${rowIndex}`}>
          {r.map((c, columnIndex) => (
            <div
              className={cn(styles.cell, {
                [styles.boldCellLeft]: columnIndex % 3 === 0,
                [styles.boldCellRight]: columnIndex % 3 === 2,
                [styles.boldCellTop]: rowIndex % 3 === 0,
                [styles.boldCellBottom]: rowIndex % 3 === 2,
                [styles.selectedCell]: selectedIndexes.some(
                  (i) => i.row === rowIndex && i.column === columnIndex
                ),
                [styles.invalidCell]: invalid.some(
                  (x) => rowIndex === x.row && columnIndex === x.column
                ),
              })}
              onClick={(e) => cellOnClick(e, rowIndex, columnIndex)}
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
      <SudokuSetupPanel selectedCells={selectedIndexes} />
    </div>
  );
}
