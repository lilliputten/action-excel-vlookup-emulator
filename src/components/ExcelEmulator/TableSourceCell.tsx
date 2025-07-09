import { getExcelCellIdByColName } from '@/lib/ExcelEmulator/getExcelCellIdByColName';
import { isDev } from '@/config';
import { inputCellFieldId, sourceCellKey } from '@/constants/ExcelEmulator/table';
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
    const keyId = getExcelCellIdByColName(sourceCellKey);
    if (inputCellField && !inputCellField.value.endsWith(keyId)) {
      inputCellField.value += keyId;
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
        isChecked &&
          'before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:border-[2px] before:border-dashed before:border-pink-500 before:content-[""]',
        className,
      )}
      onClick={isWaitingForClick ? handleClick : undefined}
    />
  );
}
