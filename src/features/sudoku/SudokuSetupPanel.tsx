import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import { useDispatch, useSelector } from "react-redux";

import {
  initializeBoard,
  constraints as cst,
  importConstraints,
  sudokuConstraintTypes,
  CellIndex,
  SudokuConstraintType,
  addConstrainst,
} from "./sudokuSlice";

import styles from "./Sudoku.module.css";

interface SudokuSetupPanelProps {
  selectedCells: Array<CellIndex>;
}

export function SudokuSetupPanel(props: SudokuSetupPanelProps) {
  const dispatch = useDispatch();
  const constraints = useSelector(cst);

  const [newRow, setNewRow] = useState(9);
  const [newColumn, setNewColumn] = useState(9);
  const [constraintsString, setConstraintsString] = useState("");
  const [constraintValid, setConstraintValid] = useState(true);

  const [newConstraintType, setNewConstraintType] = useState<
    SudokuConstraintType
  >("distinct");

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      const newConstraints = JSON.parse(constraintsString);
      console.dir(newConstraints);
      if (
        Array.isArray(newConstraints) &&
        newConstraints.every((c) => sudokuConstraintTypes.includes(c.type))
      ) {
        setConstraintValid(true);
      } else {
        setConstraintValid(false);
      }
    } catch (e) {
      //   console.error(e);
      setConstraintValid(false);
    }
  }, [constraintsString]);

  function exportConstraint() {
    setConstraintsString(JSON.stringify(constraints));
  }

  function copyConstraint() {
    console.log(constraintsString);
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand("copy");
    }
  }

  function importString() {
    if (constraintValid) {
      return;
    }
    dispatch(importConstraints(constraintsString));
  }

  return (
    <>
      <div className={styles.row}>
        <h2>Set up panel</h2>
      </div>
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
      <div className={styles.row}>
        <textarea
          className={cn(styles.textArea, {
            [styles.invalidCell]: !constraintValid,
          })}
          value={constraintsString}
          onChange={(e) => setConstraintsString(e.target.value)}
          rows={5}
          ref={textAreaRef}
        />
      </div>
      <div className={styles.row}>
        <button className={styles.button} onClick={() => exportConstraint()}>
          Export
        </button>
        <button className={styles.button} onClick={() => copyConstraint()}>
          Copy
        </button>
        <button className={styles.button} onClick={() => importString()}>
          Import
        </button>
      </div>
      <div className={styles.row}>
        <p>{props.selectedCells.length} selected cell(s)</p>
      </div>
      <div className={styles.row}>
        <p>New constraint type - </p>
        <select
          value={newConstraintType}
          onChange={(e) => {
            setNewConstraintType(e.target.value as SudokuConstraintType);
          }}
        >
          {sudokuConstraintTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className={styles.row}>
        <button
          className={styles.button}
          onClick={() =>
            dispatch(
              addConstrainst({
                cells: props.selectedCells,
                type: newConstraintType,
              })
            )
          }
        >
          Add new constraint
        </button>
      </div>
    </>
  );
}
