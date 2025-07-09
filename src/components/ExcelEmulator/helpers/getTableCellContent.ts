import { getCellName, getColName } from '@/lib/ExcelEmulator';
import { cellSpecs, colsData, mainTableFirstRow } from '@/constants/ExcelEmulator';

import { TOptionalColSpec } from '../TColSpec';
import { checkIfAuxTableCell } from './checkIfAuxTableCell';
import { checkIfMainTableCell } from './checkIfMainTableCell';

export function getTableCellContent(rowIndex: number, colIndex: number) {
  const colName = getColName(colIndex);
  const cellKey = getCellName(rowIndex, colIndex);
  const isMainTableCell = checkIfMainTableCell(rowIndex, colIndex);
  const isAuxTableCell = checkIfAuxTableCell(rowIndex, colIndex);
  // const mainColSpec: TOptionalColSpec = isMainTableCell ? mainColSpecs[colName] : undefined;
  const cellSpec: TOptionalColSpec = cellSpecs[cellKey];
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
