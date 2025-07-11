import React from 'react';
import { toast } from 'react-toastify';

import { defaultToastOptions, isDev } from '@/config';
import {
  editedLookupRangeName,
  equationBegin,
  expectedColumnNumber,
  expectedIntervalValue,
  inputCellFieldId,
  inputErrorsBeforeWarn,
  lookupRangeName,
  resultDataFinal,
  resultDataRaw,
  sourceCellName,
  substrCellName,
  successReactionDelay,
} from '@/constants/ExcelEmulator';
import { useProgressContext } from '@/contexts/ProgressContext';
import { defaultStepsValues, ProgressSteps } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';
import { ToolTip } from './ToolTip';

function normalizeInputString(str: string) {
  return str.trim().replace(/\s+/g, '').toUpperCase();
}

interface TMemo {
  inputErrorsCount: number;
  errorsCount: number;
}

export function TableInputCell(props: TTableCellProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { className, colIndex, ...rest } = props;
  const { step, setNextStep } = useProgressContext();
  const memo = React.useMemo<TMemo>(() => ({ inputErrorsCount: 0, errorsCount: 0 }), []);
  const [error, setError] = React.useState<string | undefined>();
  const setErrorIncrement = React.useCallback(
    (error: string | undefined) => {
      setError(error);
      memo.errorsCount = error ? memo.errorsCount + 1 : 0;
      memo.inputErrorsCount = 0;
    },
    [memo],
  );
  React.useEffect(() => {
    const inputNode = inputRef.current;
    // Detect F4 press for equation edit (while wait for adding of '$' signs)
    if (step === ProgressSteps.StepEditLookupRange && inputNode) {
      const detectF4 = (ev: KeyboardEvent) => {
        if (ev.key === 'F4') {
          const value = defaultStepsValues[step + 1];
          if (value) {
            inputNode.value = value;
            toast.success(
              'Закреплён диапазон: "' + editedLookupRangeName + '".',
              defaultToastOptions,
            );
            setTimeout(setNextStep, successReactionDelay);
          }
        }
      };
      inputNode.addEventListener('keydown', detectF4);
      return () => {
        inputNode.removeEventListener('keydown', detectF4);
      };
    }
  }, [step, inputRef, setNextStep]);
  React.useEffect(() => {
    // Reset errors on a step change
    memo.inputErrorsCount = 0;
    memo.errorsCount = 0;
    setError(undefined);
  }, [step, memo]);
  /** Ready to show extended data and show raw results*/
  const isEquationFinished = step >= ProgressSteps.StepExtendRawResults;
  const isStepAddSubstrColumn = step === ProgressSteps.StepAddSubstrColumn;
  const hideInput = isEquationFinished && !isStepAddSubstrColumn;
  const showDragHandler =
    step === ProgressSteps.StepExtendRawResults || step >= ProgressSteps.StepExtendFinalResults;
  /** Ready to show final results */
  const isEquationFinal = step >= ProgressSteps.StepExtendFinalResults;
  const isStepStart = step === ProgressSteps.StepStart;
  const isStepSelectEquatonAgain = step === ProgressSteps.StepSelectEquatonAgain;
  const handleClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (isStepStart || isStepSelectEquatonAgain) {
      setNextStep();
      // setTimeout(setNextStep, successReactionDelay);
    }
  };
  const handleInput = (ev: React.FormEvent<HTMLInputElement>) => {
    const node = ev.currentTarget;
    const text = normalizeInputString(node.value);
    const __debugQuickEquation = false;
    const expectedValue = defaultStepsValues[step + 1];
    const isCorrectValue = text === expectedValue;
    const isPartialValue = isCorrectValue || expectedValue.startsWith(text);
    if (isPartialValue) {
      memo.inputErrorsCount = 0;
      memo.errorsCount = 0;
      setError(undefined);
    } else {
      memo.inputErrorsCount++;
    }
    /* // DEBUG
     * console.log('[TableInputCell:handleInput]', {
     *   inputErrorsCount: memo.inputErrorsCount,
     *   errorsCount: memo.errorsCount,
     *   isCorrectValue,
     *   text,
     *   expectedValue,
     * });
     */
    if (step === ProgressSteps.StepEquationStart) {
      if (__debugQuickEquation && isDev ? !!text : isCorrectValue) {
        node.value = equationBegin;
        // node.blur();
        toast.success('Введено начало формулы: "' + text + '".', defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement(
          'Ожидается ввод формулы (формулы в Excel начинаются со знака "=", за которым следует краткое название функции и открывающая скобка).',
        );
      }
    }
    if (step === ProgressSteps.StepEquationSemicolon) {
      if (isCorrectValue) {
        toast.success('Добавлен разделитель (точка с запятой).', defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement('Ожидается ввод разделителя (точка с запятой, ";").');
      }
    }
    if (step === ProgressSteps.StepSelectSourceColumn) {
      if (isCorrectValue) {
        toast.success('Выбран исходный столбец: ' + sourceCellName, defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement('Ожидается ввод адрес исходного столбца для поиска.');
      }
    }
    if (step === ProgressSteps.StepSelectLookupRange) {
      if (text.endsWith(';' + lookupRangeName)) {
        // Wait for ';E6:H16'
        toast.success('Введён диапазон: "' + lookupRangeName + '".', defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement(
          'Ожидается ввод диапазона ячеек (адреса начальной и конечной ячеек через двоеточие).',
        );
      }
    }
    if (step === ProgressSteps.StepEditLookupRange) {
      // Wait for ';$E$6:$H$16'
      if (text.endsWith(editedLookupRangeName)) {
        toast.success('Закреплён диапазон: "' + editedLookupRangeName + '".', defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement(
          'Добавьте знаки доллара вокруг адресов столбцов во вставленном диапазоне.',
        );
      }
    }
    if (step === ProgressSteps.StepAddColumnNumber) {
      if (text.endsWith(';' + expectedColumnNumber)) {
        toast.success('Введён номер столбца: "' + expectedColumnNumber + '".', defaultToastOptions);
        setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement(
          ['Ожидается номер столбца', memo.errorsCount && `(${expectedColumnNumber})`]
            .filter(Boolean)
            .join(' '),
        );
      }
    }
    if (step === ProgressSteps.StepAddInterval) {
      if (text.endsWith(';' + expectedIntervalValue)) {
        toast.success(
          'Введено значение интервального просмотра: "' + expectedIntervalValue + '".',
          defaultToastOptions,
        );
        setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement(
          [
            'Ожидается значение интервального просмотра',
            memo.errorsCount && `(${expectedIntervalValue})`,
          ]
            .filter(Boolean)
            .join(' '),
        );
      }
    }
    if (step === ProgressSteps.StepFinishEquation) {
      if (text.endsWith(')')) {
        toast.success('Завершён ввод формулы. Теперь нажмите Enter.', defaultToastOptions);
        // setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement('Ожидается ввод закрывающей скобки.');
      }
    }
    if (step === ProgressSteps.StepAddSubstrColumn) {
      if (text.endsWith('-' + substrCellName)) {
        toast.success(
          'Введён адрес столбца для вычитания: "' + substrCellName + '". Теперь нажмите Enter.',
          defaultToastOptions,
        );
        // setTimeout(setNextStep, successReactionDelay);
      } else if (memo.inputErrorsCount > inputErrorsBeforeWarn) {
        setErrorIncrement(
          'Ожидается ввод знака "минус" и адреса столбца, значения которого надо вычитать из результатов формулы.',
        );
      }
    }
  };
  const handleEnter = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const node = inputRef.current;
    if (node) {
      const text = normalizeInputString(node.value);
      if (step === ProgressSteps.StepFinishEquation) {
        if (text.endsWith(')')) {
          // node.blur();
          toast.success('Введена формула: "' + text + '".', defaultToastOptions);
          setTimeout(setNextStep, successReactionDelay);
        } else {
          toast.error('Ожидается ввод закрывающей скобки.', defaultToastOptions);
        }
      }
      if (step === ProgressSteps.StepAddSubstrColumn) {
        if (text.endsWith('-' + substrCellName)) {
          // node.blur();
          toast.success('Завершён ввод. Значение формулы: "' + text + '".', defaultToastOptions);
          setTimeout(setNextStep, successReactionDelay);
        } else {
          toast.error(
            'Ожидается ввод знака "минус" и адреса столбца, значения которого надо вычитать из результатов формулы.',
            defaultToastOptions,
          );
        }
      }
    }
  };
  return (
    <TableCell
      {...rest}
      colIndex={colIndex}
      className={cn(
        isDev && '__TableInputCell', // DEBUG
        'border-2 border-solid',
        error ? 'border-red-500' : 'border-blue-500',
        'p-0',
        showDragHandler && 'cursor-crosshair',
        className,
      )}
      onClick={handleClick}
    >
      <form
        className={cn(
          isDev && '__TableInputCell_Form', // DEBUG
          hideInput && 'hidden',
        )}
        onSubmit={handleEnter}
      >
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
            hideInput && 'hidden',
          )}
          onInput={handleInput}
          autoComplete="off"
        />
      </form>
      {hideInput && (
        <span>
          {/* Just render non-empty cell to prevent collpaing and keep tooltip at the bottom */}
          {isEquationFinal ? resultDataFinal[0] : resultDataRaw[0]}
        </span>
      )}
      {showDragHandler && (
        <div
          className={cn(
            isDev && '__TableInputCell_DragHandler', // DEBUG
            'absolute -bottom-[5px] -right-[5px]',
            'size-[5px]',
            'bg-blue-500',
            'border-[2px] border-solid border-white',
            'z-10',
            'cursor-crosshair',
          )}
        />
      )}
      {!!error && (
        <ToolTip className="max-w-[500px]" id="Error" isError>
          {error}
        </ToolTip>
      )}
    </TableCell>
  );
}
