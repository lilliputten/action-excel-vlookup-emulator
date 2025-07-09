import {
  lookupTableFirstCol,
  lookupTableFirstRow,
  lookupTableLastCol,
  lookupTableLastRow,
} from '@/constants/ExcelEmulator/table';

export function isCellInLookupTable(rowIndex: number, colIndex: number) {
  const isMainTableCell =
    colIndex >= lookupTableFirstCol &&
    colIndex <= lookupTableLastCol &&
    rowIndex >= lookupTableFirstRow &&
    rowIndex <= lookupTableLastRow;
  return isMainTableCell;
}
