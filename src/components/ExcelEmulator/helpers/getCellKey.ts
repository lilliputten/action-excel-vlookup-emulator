import { idDelim } from '../constants/table';
import { getColName } from '../utils/getColName';

export function getCellKey(rowIndex: number, colIndex?: number) {
  const colName = colIndex != undefined ? getColName(colIndex) : '';
  return [String(rowIndex), colName].filter(Boolean).join(idDelim);
}
