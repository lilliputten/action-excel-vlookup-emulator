import { getColName } from '@/lib/ExcelEmulator';
import { TCellName } from '@/types/ExcelEmulator';

export const colsCount = 12;
export const rowsCount = 25;

export const idDelim = '_';

// Main page
export const mainTableFirstRow = 3;
export const mainTableLastRow = 18;
export const mainTableFirstCol = 1;
export const mainTableLastCol = 8;
export const mainTableColsCount = mainTableLastCol - mainTableFirstCol + 1;

// Tagret table
export const targetAreaFirstRow = mainTableFirstRow + 3;
export const targetAreaLastRow = mainTableLastRow - 2;
export const targetAreaCol = 10;
// export const targetAreaLastCol = 10;
export const targetAreaColsCount = 1; // targetAreaLastCol - targetAreaCol + 1;

export const targetRangeFirstCellName: TCellName = getColName(targetAreaCol) + targetAreaFirstRow;
export const targetRangeLastCellName: TCellName = getColName(targetAreaCol) + targetAreaLastRow;

// Column number 10, row 3
export const inputCellName: TCellName = getColName(targetAreaCol) + targetAreaFirstRow;
export const inputCellFieldId = 'InputCellField';

// Lookup table
export const lookupTableFirstRow = targetAreaFirstRow;
export const lookupTableLastRow = targetAreaLastRow;
export const lookupTableFirstCol = 6;
export const lookupTableLastCol = 8;
export const lookupTableColsCount = lookupTableLastCol - lookupTableFirstCol + 1;

export const lookupRangeFirstCellName: TCellName =
  getColName(lookupTableFirstCol) + lookupTableFirstRow;
export const lookupRangeLastCellName: TCellName =
  getColName(lookupTableLastCol) + lookupTableLastRow;
/** Lookup range address, in form '{startColName}{startRowIndex}:{endColName}{endRowIndex}' */
export const lookupRangeName = lookupRangeFirstCellName + ':' + lookupRangeLastCellName;
/** Edited lookup range address -- with '$' symbols around column names */
export const editedLookupRangeName =
  '$' +
  getColName(lookupTableFirstCol) +
  '$' +
  lookupTableFirstRow +
  ':' +
  '$' +
  getColName(lookupTableLastCol) +
  '$' +
  lookupTableLastRow;

// Column number 2, row 3
export const sourceCol = 2;
export const sourceCellName: TCellName = getColName(sourceCol) + targetAreaFirstRow;

export const substrCol = 4;
export const substrCellName: TCellName = getColName(substrCol) + targetAreaFirstRow;

export const gridTemplateColumns = Array.from(Array(colsCount))
  .map((_none, no) => (no ? '1fr' : 'min-content'))
  .join(' ');

export const rulerCellClassNames =
  'bg-gray-500 px-2 text-center border border-solid border-white text-white cursor-default border-t-0 border-l-0';

// Expected Values
export const expectedColumnNumber = 2;
export const expectedIntervalValue = 0;

export const equationBegin = '=ВПР(';
// export const equationEnd = `;${expectedColumnNumber};${expectedIntervalValue})`;

// User input errors allowed before warning
export const inputErrorsBeforeWarn = 2;
