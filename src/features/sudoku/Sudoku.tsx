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
  validateConstraint as validateConstraintAction,
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
  const [adminMode, setAdminMode] = useState(false);

  // // Initialize the board on load
  // useEffect(() => {
  //   dispatch(setPredefined({ row: 4, column: 5, predefined: true, number: 3 }));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const togglePencilMark = () => setIsSetPencilMark((x) => !x);
  const validateConstraint = () => dispatch(validateConstraintAction());
  const clearSelection = () => {
    setSelectedIndexes([]);
    dispatch(clearInvalidCells());
  };

  useKeyDown(({ key, keyCode, ctrlKey }) => {
    // Temporarily only support one select cell
    // if (selectedIndexes.length === 1) {
    // console.log(
    //   "keyDown",
    //   key,
    //   "cell",
    //   selectedIndexes.row,
    //   selectedIndexes.column
    // );

    if (key.toLowerCase() === "t") {
      togglePencilMark();
      return;
    } else if (key.toLowerCase() === "v") {
      validateConstraint();
      return;
    } else if (key.toLowerCase() === "c") {
      clearSelection();
      return;
    } else if (ctrlKey && key.toLowerCase() === "a") {
      setAdminMode((a) => !a);
      return;
    }

    for (const selectedIndex of selectedIndexes) {
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
      } else if (key === "Backspace" || key === "Delete") {
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
    }
    // } else if (selectedIndexes.length > 1) {
    //   console.warn("Keydown on multiple selected cell is not supported (yet).");
    // }
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
      // Remove selection if selecting the one and only one
      if (
        selectedIndexes.length === 1 &&
        selectedIndexes[0].column === columnIndex &&
        selectedIndexes[0].row === rowIndex
      ) {
        setSelectedIndexes([]);
      }
      // Set a new selected index
      else {
        setSelectedIndexes([{ row: rowIndex, column: columnIndex }]);
      }
    }
  }

  return (
    <div>
      <div className={styles.row}>
        <button className={styles.button} onClick={togglePencilMark}>
          {isSetPencilMark ? "Entering Pencil Mark (T)" : "Entering Answer (T)"}
        </button>
        <button className={styles.button} onClick={validateConstraint}>
          Validate (V)
        </button>
        <button className={styles.button} onClick={clearSelection}>
          Clear selection (C)
        </button>
      </div>
      {adminMode && (
        <div className={styles.row}>
          <p style={{ color: "red" }}>Admin mode</p>
        </div>
      )}
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
              <div
                className={cn({
                  [styles.predefinedCell]: c.predefined,
                })}
              >
                {c.confirmed}
              </div>
            </div>
          ))}
        </div>
      ))}
      {adminMode && <SudokuSetupPanel selectedCells={selectedIndexes} />}
    </div>
  );
}
