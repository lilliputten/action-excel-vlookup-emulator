import { mainTableFirstCol, targetAreaCol } from '@/constants/ExcelEmulator/table';

import { isCellInMainTable } from './isCellInMainTable';
import { isCellInTargetTable } from './isCellInTargetTable';

export function isInnerTableCol(rowIndex: number, colIndex: number) {
  const isMainTableCell = isCellInMainTable(rowIndex, colIndex);
  const isTargetTableCell = isCellInTargetTable(rowIndex, colIndex);
  if (isMainTableCell && colIndex !== mainTableFirstCol) {
    return true;
  }
  if (isTargetTableCell && colIndex !== targetAreaCol) {
    return true;
  }
  return false;
}
