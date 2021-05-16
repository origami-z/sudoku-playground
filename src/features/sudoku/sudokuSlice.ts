import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import default9x9Constraint from "./classis9x9defaultConstraints.json";

interface CellData {
  confirmed?: number;
  pencilMarks: number[];
  possible: number[];
  predefined: boolean;
}

export interface CellIndex {
  row: number;
  column: number;
}

export const sudokuConstraintTypes = [
  "distinct",
  "equality", // unsupported
  "inequality", // unsupported
  "sumTo", // unsupported
] as const;
export type SudokuConstraintType = typeof sudokuConstraintTypes[number];

interface SudokuConstraint {
  cells: Array<CellIndex>;
  type: SudokuConstraintType;
}

interface SudokuState {
  rowCount: number;
  columnCount: number;

  cellData: Array<Array<CellData>>;

  constraints: Array<SudokuConstraint>;
  invalidCells: Array<CellIndex>;
}

const nineByNineEmpty = new Array(9).fill(undefined);

const newInitialCellData: Array<Array<CellData>> = nineByNineEmpty.map((_1) =>
  nineByNineEmpty.map((_2) => ({
    possible: Array.from(Array(9).keys()),
    pencilMarks: [],
    confirmed: undefined,
    predefined: false,
  }))
);

const seed1 =
  "5-482--69;---7-9-1-;---546---;2-695--3-;1396-42--;7---129--;62-4-----;9--2--473;--3-97--2;";

seed1.split(";").forEach((r, rowIndex) => {
  for (let columnIndex = 0; columnIndex < r.length; columnIndex++) {
    const c = r.charAt(columnIndex);
    if (c !== "-") {
      newInitialCellData[rowIndex][columnIndex].confirmed = Number.parseInt(c);
      newInitialCellData[rowIndex][columnIndex].predefined = true;
    }
  }
});

const initialState: SudokuState = {
  rowCount: 0,
  columnCount: 0,
  cellData: newInitialCellData,
  constraints: default9x9Constraint as Array<SudokuConstraint>,
  invalidCells: [],
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

      const cellData: Array<Array<CellData>> = Array(row).fill(
        Array(column).fill({
          possible: Array.from(Array(column).keys()),
          pencilMarks: [],
        })
      );
      state.cellData = cellData;

      const rowConstraints: Array<SudokuConstraint> = cellData.map(
        (r, rIndex) => ({
          cells: r.map((_, cIndex) => ({ row: rIndex, column: cIndex })),
          type: "distinct",
        })
      );

      const columnConstraints: Array<SudokuConstraint> = cellData.map(
        (r, rIndex) => ({
          cells: r.map((_, cIndex) => ({ column: rIndex, row: cIndex })),
          type: "distinct",
        })
      );

      state.constraints = [...rowConstraints, ...columnConstraints];
    },
    setPencilMark: (
      state,
      action: PayloadAction<{ row: number; column: number; number: number }>
    ) => {
      const { row, column, number } = action.payload;

      if (state.cellData[row][column].predefined) {
        return;
      }
      state.cellData = state.cellData.map((r, rIndex) =>
        r.map((c, cIndex) => {
          if (rIndex === row && cIndex === column) {
            return {
              ...c,
              pencilMarks: Array.from(new Set(c.pencilMarks).add(number)),
            };
          } else {
            return c;
          }
        })
      );
    },
    clearPencilMark: (
      state,
      action: PayloadAction<{ row: number; column: number }>
    ) => {
      const { row, column } = action.payload;

      state.cellData = state.cellData.map((r, rIndex) =>
        r.map((c, cIndex) => {
          if (rIndex === row && cIndex === column) {
            return {
              ...c,
              pencilMarks: [],
            };
          } else {
            return c;
          }
        })
      );
    },
    setFinalNumber: (
      state,
      action: PayloadAction<{ row: number; column: number; number: number }>
    ) => {
      const { row, column, number } = action.payload;

      if (state.cellData[row][column].predefined) {
        return;
      }

      state.cellData = state.cellData.map((r, rIndex) =>
        r.map((c, cIndex) => {
          if (rIndex === row && cIndex === column) {
            return {
              ...c,
              confirmed: number,
            };
          } else {
            return c;
          }
        })
      );
    },
    clearFinalNumber: (
      state,
      action: PayloadAction<{ row: number; column: number }>
    ) => {
      const { row, column } = action.payload;

      if (state.cellData[row][column].predefined) {
        return;
      }

      state.cellData = state.cellData.map((r, rIndex) =>
        r.map((c, cIndex) => {
          if (rIndex === row && cIndex === column) {
            return {
              ...c,
              confirmed: undefined,
            };
          } else {
            return c;
          }
        })
      );
    },
    setPredefined: (
      state,
      action: PayloadAction<{
        row: number;
        column: number;
        number: number;
        predefined?: boolean;
      }>
    ) => {
      const { row, column, number, predefined = false } = action.payload;

      state.cellData = state.cellData.map((r, rIndex) =>
        r.map((c, cIndex) => {
          if (rIndex === row && cIndex === column) {
            return {
              ...c,
              confirmed: number,
              pencilMarks: [],
              predefined: predefined,
            };
          } else {
            return c;
          }
        })
      );
    },
    clearPredefined: (
      state,
      action: PayloadAction<{ row: number; column: number }>
    ) => {
      const { row, column } = action.payload;

      state.cellData = state.cellData.map((r, rIndex) =>
        r.map((c, cIndex) => {
          if (rIndex === row && cIndex === column) {
            return {
              ...c,
              confirmed: undefined,
              predefined: false,
            };
          } else {
            return c;
          }
        })
      );
    },
    validateConstraint: (state) => {
      const invalidSet = new Set<CellIndex>();

      state.constraints.forEach((constraint) => {
        switch (constraint.type) {
          case "distinct":
            for (let i = 0; i < constraint.cells.length; i++) {
              for (let j = i + 1; j < constraint.cells.length; j++) {
                const firstValue =
                  state.cellData[constraint.cells[i].row][
                    constraint.cells[i].column
                  ].confirmed;
                const secondValue =
                  state.cellData[constraint.cells[j].row][
                    constraint.cells[j].column
                  ].confirmed;
                if (firstValue && firstValue === secondValue) {
                  invalidSet.add(constraint.cells[i]);
                  invalidSet.add(constraint.cells[j]);
                }
              }
            }
        }
      });

      state.invalidCells = Array.from(invalidSet);
    },
    clearInvalidCells: (state) => {
      state.invalidCells = [];
    },
    // exportConstraint: (state) => {
    //   console.dir(JSON.stringify(state.constraints));
    // },
    importConstraints: (state, action: PayloadAction<string>) => {
      state.constraints = JSON.parse(action.payload);
    },
    addConstrainst: (state, action: PayloadAction<SudokuConstraint>) => {
      state.constraints.push(action.payload);
    },
  },
});

export const {
  initializeBoard,
  setPencilMark,
  clearPencilMark,
  setFinalNumber,
  clearFinalNumber,
  validateConstraint,
  clearInvalidCells,
  // exportConstraint,
  importConstraints,
  addConstrainst,
  setPredefined,
  clearPredefined,
} = sudokuSlice.actions;

export const rowCount = (state: RootState) => state.sudoku.rowCount;
export const columnCount = (state: RootState) => state.sudoku.columnCount;
export const cellData = (state: RootState) => state.sudoku.cellData;
export const invalidCells = (state: RootState) => state.sudoku.invalidCells;
export const constraints = (state: RootState) => state.sudoku.constraints;

export default sudokuSlice.reducer;
