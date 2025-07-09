import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import { cn } from '@/lib';

import { TableCell } from './TableCell';
import { TTableCellProps } from './types/propTypes';

export function TableHintCell(props: TTableCellProps) {
  const { className, colIndex, ...rest } = props;
  const { hintCelClassName } = useStepData();
  // const { setNextStep } = useProgressContext();
  // const isWaitForClick = hintCellAction === 'click';
  return (
    <TableCell
      {...rest}
      colIndex={colIndex}
      className={cn(
        isDev && '__TableHintCell', // DEBUG
        // 'border-2 border-solid border-pink-500',
        // isWaitForClick &&
        //   'before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:border before:border-dashed before:border-blue-500 before:content-[""]',
        hintCelClassName,
        className,
      )}
      // onClick={isWaitForClick ? setNextStep : undefined}
    />
  );
}
