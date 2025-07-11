import { mainTableFirstRow, targetAreaFirstRow } from '@/constants/ExcelEmulator/table';

import { isCellInMainTable } from './isCellInMainTable';
import { isCellInTargetTable } from './isCellInTargetTable';

export function isInnerTableRow(rowIndex: number, colIndex: number) {
  const isMainTableCell = isCellInMainTable(rowIndex, colIndex);
  const isTargetTableCell = isCellInTargetTable(rowIndex, colIndex);
  if (isMainTableCell && rowIndex !== mainTableFirstRow) {
    return true;
  }
  if (isTargetTableCell && rowIndex !== targetAreaFirstRow) {
    return true;
  }
  return false;
}
