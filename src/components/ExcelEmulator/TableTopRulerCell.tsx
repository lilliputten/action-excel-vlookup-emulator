import { isDev } from '@/config';
import { cn } from '@/lib';

import { rulerCellClassNames } from './constants/table';
import { getColName } from './helpers/getColName';
import { TableCell } from './TableCell';
import { TTableCellProps } from './types/propTypes';

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
