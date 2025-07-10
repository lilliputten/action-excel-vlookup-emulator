import React from 'react';
import { toast } from 'react-toastify';

import { defaultToastOptions, isDev } from '@/config';
import {
  editedLookupRangeName,
  editionsBeforeWarn,
  equationBegin,
  expectedColumnNumber,
  expectedIntervalValue,
  inputCellFieldId,
  lookupRangeName,
  sourceCellName,
  successReactionDelay,
} from '@/constants/ExcelEmulator';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';

function normalizeInputString(str: string) {
  return str.trim().replace(/\s+/g, '').toUpperCase();
}

export function TableInputCell(props: TTableCellProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { className, colIndex, ...rest } = props;
  const { step, setNextStep } = useProgressContext();
  const [editionsCount, setEditionsCount] = React.useState(0);
  React.useEffect(() => setEditionsCount(0), [step]);
  const isEquationFinished = step >= ProgressSteps.StepExtendResults;
  const isStepStart = step === ProgressSteps.StepStart;
  const handleClick = (ev: React.MouseEvent<HTMLInputElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (isStepStart) {
      setNextStep();
      // setTimeout(setNextStep, successReactionDelay);
    }
  };
  const handleInput = (ev: React.FormEvent<HTMLInputElement>) => {
    const node = ev.currentTarget;
    const text = normalizeInputString(node.value);
    if (
      step === ProgressSteps.StepEquationStart &&
      (isDev ? !!text : text.startsWith(equationBegin))
    ) {
      node.value = equationBegin;
      // node.blur();
      toast.success('Введено начало формулы: ' + text, defaultToastOptions);
      setTimeout(setNextStep, successReactionDelay);
    }
    if (step === ProgressSteps.StepEquationSemicolon && text.endsWith(';')) {
      toast.success('Добавлена точка с запятой. Формула: ' + text, defaultToastOptions);
      setTimeout(setNextStep, successReactionDelay);
    }
    if (step === ProgressSteps.StepSelectSourceColumn && text.endsWith(';' + sourceCellName)) {
      toast.success('Выбран исходный столбец: ' + sourceCellName, defaultToastOptions);
      setTimeout(setNextStep, successReactionDelay);
    }
    if (step === ProgressSteps.StepSelectLookupRange && text.endsWith(';' + lookupRangeName)) {
      // Wait for ';E6:H16'
      toast.success('Введён диапазон: ' + lookupRangeName, defaultToastOptions);
      setTimeout(setNextStep, successReactionDelay);
    }
    if (step === ProgressSteps.StepEditLookupRange) {
      // Wait for ';$E$6:$H$16'
      if (text.endsWith(editedLookupRangeName)) {
        toast.success('Исправлен диапазон: ' + editedLookupRangeName, defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      } else if (editionsCount > 3 + editionsBeforeWarn && text.match(/^=.*;.*:.*;.+/)) {
        toast.warn(
          'Добавьте знаки доллара вокруг адресов столбцов во вставленном диапазоне.',
          defaultToastOptions,
        );
      }
    }
    if (step === ProgressSteps.StepAddColumnNumber) {
      if (text.endsWith(';' + expectedColumnNumber)) {
        toast.success('Введён номер столбца: ' + expectedColumnNumber, defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      } else if (editionsCount > editionsBeforeWarn && text.match(/^=.*;.*:.*;.+/)) {
        toast.warn('Ожидается номер столбца', defaultToastOptions);
      }
    }
    if (step === ProgressSteps.StepAddInterval) {
      if (text.endsWith(';' + expectedIntervalValue)) {
        toast.success(
          'Введено значение интервального просмотра: ' + expectedIntervalValue,
          defaultToastOptions,
        );
        setTimeout(setNextStep, successReactionDelay);
      } else if (editionsCount > editionsBeforeWarn && text.match(/^=.*;.*:.*;.*;.+/)) {
        toast.warn('Ожидается значение интервального просмотра', defaultToastOptions);
      }
    }
    setEditionsCount((count) => count + 1);
  };
  const handleEnter = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const node = inputRef.current;
    if (node) {
      const text = normalizeInputString(node.value);
      if (step === ProgressSteps.StepFinishEquation && text.endsWith(')')) {
        // node.blur();
        toast.success('Завершён ввод формулы: ' + text, defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      }
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
      <form onSubmit={handleEnter}>
        <input
          ref={inputRef}
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
      </form>
    </TableCell>
  );
}
