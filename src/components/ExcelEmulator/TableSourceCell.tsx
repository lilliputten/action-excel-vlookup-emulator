import React from 'react';

import { isDev } from '@/config';
import { successReactionDelay } from '@/constants/ExcelEmulator';
import { inputCellFieldId, sourceCellName } from '@/constants/ExcelEmulator/table';
import { useFireworksContext } from '@/contexts/FireworksContext';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';

export function TableSourceCell(props: TTableCellProps) {
  const { className, colIndex, ...rest } = props;
  const { startFireworks } = useFireworksContext();
  const { step, setNextStep } = useProgressContext();
  const isWaitingForClick = step === ProgressSteps.StepSelectSourceColumn;
  const isChecked = step > ProgressSteps.StepSelectSourceColumn;
  const handleClick = React.useCallback(
    (ev: React.MouseEvent) => {
      const inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null;
      if (inputCellField && !inputCellField.value.endsWith(sourceCellName)) {
        inputCellField.value += sourceCellName;
        inputCellField.focus();
      }
      startFireworks({ x: ev.clientX, y: ev.clientY });
      setTimeout(setNextStep, successReactionDelay);
    },
    [startFireworks, setNextStep],
  );
  return (
    <TableCell
      {...rest}
      colIndex={colIndex}
      className={cn(
        isDev && '__TableSourceCell', // DEBUG
        isChecked && 'before:bg-green-500/20',
        className,
      )}
      onClick={isWaitingForClick ? handleClick : undefined}
    />
  );
}
