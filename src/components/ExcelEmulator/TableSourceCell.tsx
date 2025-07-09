import { isDev } from '@/config';
import { inputCellFieldId, sourceCellName } from '@/constants/ExcelEmulator/table';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';

export function TableSourceCell(props: TTableCellProps) {
  const { className, colIndex, ...rest } = props;
  const { step, setNextStep } = useProgressContext();
  const isWaitingForClick = step === ProgressSteps.StepSelectSourceColunn;
  const isChecked = step > ProgressSteps.StepSelectSourceColunn;
  const handleClick = () => {
    const inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null;
    if (inputCellField && !inputCellField.value.endsWith(sourceCellName)) {
      inputCellField.value += sourceCellName;
      inputCellField.focus();
    }
    setNextStep();
  };
  return (
    <TableCell
      {...rest}
      colIndex={colIndex}
      className={cn(
        isDev && '__TableSourceCell', // DEBUG
        // 'border-2 border-solid border-blue-500',
        isChecked && 'before:border-[2px] before:border-dashed before:border-pink-500',
        className,
      )}
      onClick={isWaitingForClick ? handleClick : undefined}
    />
  );
}
