import { useLanguage } from '@/config/lang';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';

export function TableHintCell(props: TTableCellProps) {
  const { className, colIndex, ...rest } = props;
  const lng = useLanguage();
  const { hintCellClassName } = useStepData(lng);
  return (
    <TableCell
      {...rest}
      colIndex={colIndex}
      className={cn(
        isDev && '__TableHintCell', // DEBUG
        hintCellClassName,
        className,
      )}
    />
  );
}
