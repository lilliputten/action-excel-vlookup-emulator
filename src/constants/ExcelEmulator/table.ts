import { getColName } from '@/lib/ExcelEmulator';
import { TCellName } from '@/types/ExcelEmulator';

export const colsCount = 13;
export const rowsCount = 25;

export const idDelim = '_';

// Main page
export const mainTableFirstRow = 3;
export const mainTableLastRow = 18;
export const mainTableFirstCol = 1;
export const mainTableLastCol = 8;
export const mainTableColsCount = mainTableLastCol - mainTableFirstCol + 1;

// Tagret table
export const targetTableFirstRow = mainTableFirstRow + 3;
export const targetTableLastRow = mainTableLastRow - 2;
export const targetTableFirstCol = 10;
export const targetTableLastCol = 10;
export const targetTableColsCount = targetTableLastCol - targetTableFirstCol + 1;

// Column number 10, row 3
export const inputCellName: TCellName = getColName(targetTableFirstCol) + targetTableFirstRow;
export const inputCellFieldId = 'InputCellField';

// Lookup table
export const lookupTableFirstRow = targetTableFirstRow;
export const lookupTableLastRow = targetTableLastRow;
export const lookupTableFirstCol = 6;
export const lookupTableLastCol = 8;
export const lookupTableColsCount = lookupTableLastCol - lookupTableFirstCol + 1;

export const lookupRangeFirstCellName: TCellName =
  getColName(lookupTableFirstCol) + lookupTableFirstRow;
export const lookupRangeLastCellName: TCellName =
  getColName(lookupTableLastCol) + lookupTableLastRow;
export const lookupRangeName = lookupRangeFirstCellName + ':' + lookupRangeLastCellName;

// Column number 2, row 3
export const sourceCol = 2;
export const sourceCellName: TCellName = getColName(sourceCol) + targetTableFirstRow;

export const gridTemplateColumns = Array.from(Array(colsCount))
  .map((_none, no) => (no ? '1fr' : 'min-content'))
  .join(' ');

export const rulerCellClassNames =
  'bg-gray-500 px-2 text-center border border-solid border-white text-white cursor-default border-t-0 border-l-0';
