import {
  targetAreaCol,
  targetAreaFirstRow,
  targetAreaLastRow,
} from '@/constants/ExcelEmulator/table';

export function isCellInTargetTable(rowIndex: number, colIndex: number) {
  const isMainTableCell =
    colIndex === targetAreaCol && rowIndex >= targetAreaFirstRow && rowIndex <= targetAreaLastRow;
  return isMainTableCell;
}
