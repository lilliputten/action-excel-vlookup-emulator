import { idDelim } from '@/components/ExcelEmulator/constants/table';

export function getExcelCellIdByColName(colName: string) {
  const parts = colName.split(idDelim);
  parts.reverse();
  return parts.join('');
}
