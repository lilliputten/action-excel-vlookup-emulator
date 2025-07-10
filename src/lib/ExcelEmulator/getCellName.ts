import { getColName } from '@/lib/ExcelEmulator';
import { TCellName } from '@/types/ExcelEmulator';

export function getCellName(rowIndex: number, colIndex?: number): TCellName {
  return getColName(colIndex) + String(rowIndex);
}
