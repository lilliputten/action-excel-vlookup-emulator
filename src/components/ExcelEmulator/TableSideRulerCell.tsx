import { isDev } from '@/config';
import { cn } from '@/lib';

import { rulerCellClassNames } from './constants/table';
import { TableCell } from './TableCell';
import { TTableCellProps } from './types/propTypes';

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
