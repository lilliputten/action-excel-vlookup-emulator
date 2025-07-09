import React from 'react';

import { isDev } from '@/config';
import { inputCellFieldId } from '@/constants/ExcelEmulator';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';

const equationBegin = '=ВПР(';

export function TableInputCell(props: TTableCellProps) {
  const { className, colIndex, ...rest } = props;
  const { step, setNextStep } = useProgressContext();
  const isStepStart = step === ProgressSteps.StepStart;
  const isStepEquationStart = step === ProgressSteps.StepEquationStart;
  const isStepEquationSemicolon = step === ProgressSteps.StepEquationSemicolon;
  const handleClick = (ev: React.MouseEvent<HTMLInputElement>) => {
    const node = ev.currentTarget;
    const text = node.value.trim().toUpperCase();
    console.log('[TableInputCell:handleClick]', text);
    if (isStepStart) {
      setNextStep();
    }
  };
  const handleInput = (ev: React.FormEvent<HTMLInputElement>) => {
    const node = ev.currentTarget;
    const text = node.value.trim().toUpperCase();
    console.log('[TableInputCell:handleInput]', text);
    if (isStepEquationStart && (isDev ? !!text : text.startsWith(equationBegin))) {
      node.value = equationBegin;
      setNextStep();
    }
    if (isStepEquationSemicolon && text.endsWith(';')) {
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
        )}
        onClick={handleClick}
        onInput={handleInput}
      />
    </TableCell>
  );
}
