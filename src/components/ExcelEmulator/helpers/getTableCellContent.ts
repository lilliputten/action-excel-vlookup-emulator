import { getCellName, getColName } from '@/lib/ExcelEmulator';
import { cellSpecs, colsData, mainTableFirstRow } from '@/constants/ExcelEmulator';

import { TOptionalColSpec } from '../TColSpec';
import { isCellInMainTable } from './isCellInMainTable';
import { isCellInTargetTable } from './isCellInTargetTable';

export function getTableCellContent(rowIndex: number, colIndex: number) {
  const colName = getColName(colIndex);
  const cellName = getCellName(rowIndex, colIndex);
  const isMainTableCell = isCellInMainTable(rowIndex, colIndex);
  const isAuxTableCell = isCellInTargetTable(rowIndex, colIndex);
  // const mainColSpec: TOptionalColSpec = isMainTableCell ? mainColSpecs[colName] : undefined;
  const cellSpec: TOptionalColSpec = cellSpecs[cellName];
  const cellContent = cellSpec?.content;
  if (cellContent) {
    return cellContent;
  }
  if (isMainTableCell && colsData[colName]) {
    const colContent = colsData[colName][rowIndex - mainTableFirstRow];
    if (colContent) {
      return colContent;
    }
  }
  if (isAuxTableCell) {
    return /* cellKey || */ '';
  }
  return /* isMainTableCell ? cellKey : */ '';
}
