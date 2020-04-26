import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface CellData {
  // confirmed: number;
  pencilMarks: number[];
  possible: number[];
}

interface SudokuState {
  rowCount: number;
  columnCount: number;

  cellData: Array<Array<CellData>>;
}

const initialState: SudokuState = {
  rowCount: 0,
  columnCount: 0,
  cellData: Array(9).fill(
    Array(9).fill({
      possible: Array.from(Array(9).keys()),
      pencilMarks: [],
    })
  ),
};

export const sudokuSlice = createSlice({
  name: "sudoku",
  initialState,
  reducers: {
    initializeBoard: (
      state,
      action: PayloadAction<{ row: number; column: number }>
    ) => {
      const { row, column } = action.payload;
      state.rowCount = row;
      state.columnCount = column;

      state.cellData = Array(row).fill(
        Array(column).fill({
          possible: Array.from(Array(column).keys()),
          pencilMarks: [],
        })
      );
    },
    setPencilMark: (
      state, action: PayloadAction<{ row: number, column: number, number: number }>
    ) => {
      const { row, column, number } = action.payload

      state.cellData = state.cellData.map((r, rIndex) => r.map((c, cIndex) => {
        if (rIndex === row && cIndex === column) {
          return {
            ...c,
            pencilMarks: Array.from(new Set(c.pencilMarks).add(number))
          }
        }
        else {
          return c
        }
      }))
    }
  },
});

export const { initializeBoard, setPencilMark } = sudokuSlice.actions;

export const rowCount = (state: RootState) => state.sudoku.rowCount;
export const columnCount = (state: RootState) => state.sudoku.columnCount;
export const cellData = (state: RootState) => state.sudoku.cellData;

export default sudokuSlice.reducer;
