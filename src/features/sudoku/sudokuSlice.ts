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
  },
});

export const { initializeBoard } = sudokuSlice.actions;

export const rowCount = (state: RootState) => state.sudoku.rowCount;
export const columnCount = (state: RootState) => state.sudoku.columnCount;
export const cellData = (state: RootState) => state.sudoku.cellData;

export default sudokuSlice.reducer;
