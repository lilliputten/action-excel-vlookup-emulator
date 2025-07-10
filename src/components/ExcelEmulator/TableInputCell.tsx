import React from 'react';

import { isDev } from '@/config';
import { equationBegin, equationEnd, inputCellFieldId } from '@/constants/ExcelEmulator';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';

export function TableInputCell(props: TTableCellProps) {
  const { className, colIndex, ...rest } = props;
  const { step, setNextStep } = useProgressContext();
  const isEquationFinished = step > ProgressSteps.StepEquationFinish;
  const isStepStart = step === ProgressSteps.StepStart;
  const handleClick = (_ev: React.MouseEvent<HTMLInputElement>) => {
    if (isStepStart) {
      setNextStep();
    }
  };
  const handleInput = (ev: React.FormEvent<HTMLInputElement>) => {
    const node = ev.currentTarget;
    const text = node.value.trim().toUpperCase();
    const isStepEquationStart = step === ProgressSteps.StepEquationStart;
    const isStepEquationFinish = step === ProgressSteps.StepEquationFinish;
    const isStepEquationSemicolon = step === ProgressSteps.StepEquationSemicolon;
    if (isStepEquationStart && (isDev ? !!text : text.startsWith(equationBegin))) {
      node.value = equationBegin;
      setNextStep();
    }
    if (isStepEquationFinish && text.endsWith(equationEnd)) {
      setNextStep();
    }
    if (isStepEquationSemicolon && text.endsWith(';')) {
      node.blur();
      setNextStep();
    }
  };
  return (
    <TableCell
      {...rest}
      colIndex={colIndex}
      className={cn(
        isDev && '__TableInputCell', // DEBUG
        'border-2 border-solid border-blue-500',
        'p-0',
        className,
      )}
    >
      {isEquationFinished && (
        <span>
          {/* Just render non-empty cell to prevent collpaing and keep tooltip at the bottom */}
          #Н/Д
        </span>
      )}
      <input
        type="text"
        name={inputCellFieldId}
        id={inputCellFieldId}
        className={cn(
          isDev && '__TableInputCell_Field', // DEBUG
          'w-full',
          'px-1',
          'bg-transparent',
          'text-black',
          'border-0 outline-none',
          isEquationFinished && 'hidden',
        )}
        onClick={handleClick}
        onInput={handleInput}
        autoComplete="off"
      />
    </TableCell>
  );
}
