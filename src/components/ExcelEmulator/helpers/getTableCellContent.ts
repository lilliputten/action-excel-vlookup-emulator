import { TLng } from '@/config/lang';
import { getCellName, getColName } from '@/lib/ExcelEmulator';
import {
  getCellSpecs,
  getColsData,
  mainTableFirstRow,
  resultDataFinal,
  resultDataRaw,
  targetAreaFirstRow,
} from '@/constants/ExcelEmulator';
import { ProgressSteps } from '@/contexts/ProgressSteps';

import { TOptionalColSpec } from '../TColSpec';
import { isCellInMainTable } from './isCellInMainTable';
import { isCellInTargetTable } from './isCellInTargetTable';

export function getTableCellContent(
  step: ProgressSteps,
  rowIndex: number,
  colIndex: number,
  lng: TLng,
) {
  const colName = getColName(colIndex);
  const cellName = getCellName(rowIndex, colIndex);
  const isMainTableCell = isCellInMainTable(rowIndex, colIndex);
  const isTargetTableCell = isCellInTargetTable(rowIndex, colIndex);
  const cellSpec: TOptionalColSpec = getCellSpecs(lng)[cellName];
  const cellContent = cellSpec?.content;
  if (cellContent) {
    return cellContent;
  }
  const colsData = getColsData(lng);
  if (isMainTableCell && colsData[colName]) {
    const colContent = colsData[colName][rowIndex - mainTableFirstRow];
    if (colContent) {
      return colContent;
    }
  }
  if (isTargetTableCell) {
    const isEquationFinished = step > ProgressSteps.StepExtendRawResults;
    const isEquationFinal = step > ProgressSteps.StepExtendFinalResults;
    if (isEquationFinished) {
      const targetIndex = rowIndex - targetAreaFirstRow;
      return isEquationFinal ? resultDataFinal[targetIndex] : resultDataRaw[targetIndex];
    }
    return /* cellKey || */ '';
  }
  return /* isMainTableCell ? cellKey : */ '';
}
