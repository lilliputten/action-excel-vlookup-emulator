import { TColName } from '@/types/ExcelEmulator';

export function getColName(colIndex?: number): TColName {
  if (colIndex == undefined) {
    return '_';
  }
  if (!colIndex) {
    return '0';
  }
  return String.fromCharCode('A'.charCodeAt(0) + colIndex - 1);
}
