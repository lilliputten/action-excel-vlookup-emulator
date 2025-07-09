import { isDev } from '@/config';
import { rulerCellClassNames } from '@/constants/ExcelEmulator/table';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';

export function TableSideRulerCell(props: TTableCellProps) {
  const { className, rowIndex, ...rest } = props;
  const rowLabel = String(rowIndex);
  return (
    <TableCell
      {...rest}
      rowIndex={rowIndex}
      className={cn(
        isDev && '__TableSideRulerCell', // DEBUG
        rulerCellClassNames,
        className,
      )}
    >
      {rowLabel}
    </TableCell>
  );
}
