import {
  targetTableFirstCol,
  targetTableFirstRow,
  targetTableLastCol,
  targetTableLastRow,
} from '@/constants/ExcelEmulator/table';

export function isCellInTargetTable(rowIndex: number, colIndex: number) {
  const isMainTableCell =
    colIndex >= targetTableFirstCol &&
    colIndex <= targetTableLastCol &&
    rowIndex >= targetTableFirstRow &&
    rowIndex <= targetTableLastRow;
  return isMainTableCell;
}
