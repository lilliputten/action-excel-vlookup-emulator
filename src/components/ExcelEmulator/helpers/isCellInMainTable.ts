import {
  mainTableFirstCol,
  mainTableFirstRow,
  mainTableLastCol,
  mainTableLastRow,
} from '@/constants/ExcelEmulator/table';

export function isCellInMainTable(rowIndex: number, colIndex: number) {
  const isMainTableCell =
    colIndex >= mainTableFirstCol &&
    colIndex <= mainTableLastCol &&
    rowIndex >= mainTableFirstRow &&
    rowIndex <= mainTableLastRow;
  return isMainTableCell;
}
