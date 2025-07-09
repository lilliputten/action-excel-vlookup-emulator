import { getColName } from '@/lib/ExcelEmulator';
import { idDelim } from '@/constants/ExcelEmulator/table';

export function getCellKey(rowIndex: number, colIndex?: number) {
  const colName = colIndex != undefined ? getColName(colIndex) : '';
  return [String(rowIndex), colName].filter(Boolean).join(idDelim);
}
