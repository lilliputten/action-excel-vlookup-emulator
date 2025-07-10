import { getColName } from '@/lib/ExcelEmulator';
import { isDev } from '@/config';
import { rulerCellClassNames } from '@/constants/ExcelEmulator/table';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';

export function TableTopRulerCell(props: TTableCellProps) {
  const { className, colIndex, ...rest } = props;
  const isCorner = !colIndex;
  const colLabel = getColName(colIndex);
  return (
    <TableCell
      {...rest}
      colIndex={colIndex}
      className={cn(
        isDev && '__TableTopRulerCell', // DEBUG
        rulerCellClassNames,
        isCorner && 'text-right',
        className,
      )}
    >
      {colLabel == '0' ? '◢' : colLabel}
    </TableCell>
  );
}
