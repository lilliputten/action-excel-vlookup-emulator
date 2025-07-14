import React from 'react';
// import { Fireworks } from 'fireworks-js';
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
import { useFireworksContext } from '@/contexts/FireworksContext';
import { useProgressContext } from '@/contexts/ProgressContext';
import {
  defaultStepsValues,
  getExpectedStepValue,
  getInitialStepValue,
  ProgressSteps,
} from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';
import { ToolTip } from './ToolTip';

function normalizeInputString(str: string) {
  return str.trim().replace(/\s+/g, '').toUpperCase();
}

interface TMemo {
  prevStep?: ProgressSteps;
  inputErrorsCount: number;
  errorsCount: number;
  allowedInputErrorsCount: number;
  expectedValue?: string;
}

function getCursorCoordinates(input?: HTMLInputElement) {
  if (!input) {
    return null;
  }

  const parent = input.parentNode;
  if (!parent) {
    return null;
  }

  const cursorIndex = input.selectionStart; // ?? input.value.length;
  if (!cursorIndex) {
    return null;
  }

  const div = document.createElement('div');
  // Copy computed styles from the input to the div
  const computedStyles = getComputedStyle(input);
  for (const prop of computedStyles) {
    // @ts-expect-error: Ok
    div.style[prop] = computedStyles[prop];
  }
  div.style.visibility = 'hidden'; // Hide it from view
  div.style.whiteSpace = 'pre-wrap'; // Preserve whitespace and allow wrapping
  div.style.position = 'absolute';
  div.style.left = '0';
  div.style.top = '0';
  parent.appendChild(div);

  const textBeforeCursor = input.value.substring(0, cursorIndex);
  const textAfterCursor = input.value.substring(cursorIndex);

  const preTextNode = document.createTextNode(textBeforeCursor);
  const caretMarker = document.createElement('span');
  caretMarker.innerHTML = '&nbsp;'; // Use a non-breaking space for visibility
  const postTextNode = document.createTextNode(textAfterCursor);

  div.innerHTML = ''; // Clear previous content
  div.append(preTextNode, caretMarker, postTextNode);

  const caretRect = caretMarker.getBoundingClientRect();
  const x = caretRect.left;
  const y = caretRect.top;

  parent.removeChild(div);

  return { x, y };
}

export function TableInputCell(props: TTableCellProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isInputSuccess, setIsInputSuccess] = React.useState(false);
  const { startFireworks } = useFireworksContext();
  const { className, colIndex, ...rest } = props;
  const { step, setNextStep } = useProgressContext();
  const memo = React.useMemo<TMemo>(
    () => ({
      // Default memo values
      inputErrorsCount: 0,
      errorsCount: 0,
      allowedInputErrorsCount: inputErrorsBeforeWarn,
    }),
    [],
  );
  const [error, setError] = React.useState<string | undefined>();
  const setErrorIncrement = React.useCallback(
    (error: string | undefined) => {
      setError(error);
      setIsInputSuccess(!error);
      memo.errorsCount = error ? memo.errorsCount + 1 : 0;
      memo.inputErrorsCount = 0;
    },
    [memo],
  );
  const setInputSuccess = React.useCallback(
    () => setErrorIncrement(undefined),
    [setErrorIncrement],
  );

  const goToTheNextStep = React.useCallback(
    (delay: number = 0, x?: number, y?: number) => {
      const inputCellField = inputRef.current;
      if (inputCellField && !x && !y) {
        const rect = inputCellField?.getBoundingClientRect();
        if (rect) {
          x = Math.round(rect.left + rect.right) / 2;
          y = Math.round(rect.top + rect.bottom) / 2;
        }
        const inputCoord = getCursorCoordinates(inputCellField);
        if (inputCoord) {
          x = inputCoord.x;
        }
      }
      startFireworks({ x, y });
      setInputSuccess();
      setTimeout(setNextStep, delay);
    },
    [setNextStep, startFireworks, inputRef, setInputSuccess],
  );

  // Initialize step: reset errors, setother parameters
  React.useEffect(() => {
    if (memo.prevStep != step) {
      memo.prevStep = step;
      const inputCellField = inputRef.current;
      const expectedValue = getExpectedStepValue(step);
      const currentValue = getInitialStepValue(step);
      memo.inputErrorsCount = 0;
      memo.errorsCount = 0;
      memo.expectedValue = expectedValue;
      memo.allowedInputErrorsCount = 1; // inputErrorsBeforeWarn;
      if (inputCellField) {
        inputCellField.value = currentValue;
        // // NOTE: Wait for wrongly entered amout of symbols equals the tlength of expeted correct input?
        // if (memo.expectedValue) {
        //   memo.allowedInputErrorsCount = expectedValue.length - currentValue.length - 1;
        // }
        setError(undefined);
        setIsInputSuccess(false);
      }
    }
  }, [step, memo, inputRef]);

  // Specific keystroke reader (F4 for StepEditLookupRange)
  React.useEffect(() => {
    const inputCellField = inputRef.current;
    // Detect F4 press for equation edit (while wait for adding of '$' signs)
    if (step === ProgressSteps.StepEditLookupRange && inputCellField) {
      const detectF4 = (ev: KeyboardEvent) => {
        if (ev.key === 'F4') {
          const value = defaultStepsValues[step + 1];
          if (value) {
            inputCellField.value = value;
            toast.success(
              'Закреплён диапазон: "' + editedLookupRangeName + '".',
              defaultToastOptions,
            );
            goToTheNextStep(successReactionDelay);
          }
        }
      };
      inputCellField.addEventListener('keydown', detectF4);
      return () => {
        inputCellField.removeEventListener('keydown', detectF4);
      };
    }
  }, [step, inputRef, goToTheNextStep]);

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
      goToTheNextStep(0, ev.clientX, ev.clientY);
    }
  };

  const handleInput = React.useCallback(
    (ev: React.FormEvent<HTMLInputElement>) => {
      const node = ev.currentTarget;
      const text = normalizeInputString(node.value);
      const expectedValue = memo.expectedValue || ''; // defaultStepsValues[step + 1];
      const isCorrectValue = text === expectedValue;
      const isPartialValue = isCorrectValue || expectedValue.startsWith(text);
      if (!isPartialValue) {
        memo.inputErrorsCount++;
      }
      const showHint = memo.errorsCount >= 2;
      const showNextHint = memo.errorsCount >= 4;
      if (step === ProgressSteps.StepEquationStart) {
        const __debugQuickEquation = false;
        if (__debugQuickEquation && isDev ? !!text : isCorrectValue) {
          node.value = equationBegin;
          // node.blur();
          toast.success('Введено начало формулы: "' + text + '".', defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            [
              'Ожидается ввод формулы',
              showHint &&
                (showNextHint
                  ? `(в данном случае вводите "${equationBegin}")`
                  : '(формулы в Excel начинаются со знака "=", за которым следует краткое название функции и открывающая скобка)'),
            ]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
      if (step === ProgressSteps.StepEquationSemicolon) {
        if (isCorrectValue) {
          toast.success('Добавлен разделитель (точка с запятой).', defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            ['Ожидается ввод разделителя', showHint && `(точка с запятой, ";")`]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
      if (step === ProgressSteps.StepSelectSourceColumn) {
        if (isCorrectValue) {
          toast.success('Выбран исходный столбец: ' + sourceCellName, defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement('Ожидается ввод адрес исходного столбца для поиска.');
        }
      }
      if (step === ProgressSteps.StepSelectLookupRange) {
        if (isCorrectValue) {
          // Wait for ';E6:H16'
          toast.success('Введён диапазон: "' + lookupRangeName + '".', defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            'Ожидается ввод диапазона ячеек (адреса начальной и конечной ячеек через двоеточие).',
          );
        }
      }
      if (step === ProgressSteps.StepEditLookupRange) {
        // Wait for ';$E$6:$H$16'
        if (isCorrectValue) {
          toast.success(
            'Закреплён диапазон: "' + editedLookupRangeName + '".',
            defaultToastOptions,
          );
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            'Добавьте знаки доллара вокруг адресов столбцов во вставленном диапазоне.',
          );
        }
      }
      if (step === ProgressSteps.StepAddColumnNumber) {
        if (isCorrectValue) {
          toast.success(
            'Введён номер столбца: "' + expectedColumnNumber + '".',
            defaultToastOptions,
          );
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            ['Введите номер столбца', showHint && `(${expectedColumnNumber})`]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
      if (step === ProgressSteps.StepAddInterval) {
        if (isCorrectValue) {
          toast.success(
            'Введено значение интервального просмотра: "' + expectedIntervalValue + '".',
            defaultToastOptions,
          );
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            ['Введите значение интервального просмотра', showHint && `(${expectedIntervalValue})`]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
      if (step === ProgressSteps.StepFinishEquation) {
        if (isCorrectValue) {
          toast.success('Завершён ввод формулы. Теперь нажмите Enter.', defaultToastOptions);
          setInputSuccess();
          // goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement('Введите закрывающую скобку.');
        }
      }
      if (step === ProgressSteps.StepAddSubstrColumn) {
        if (isCorrectValue) {
          toast.success(
            'Введён адрес столбца для вычитания: "' + substrCellName + '". Теперь нажмите Enter.',
            defaultToastOptions,
          );
          setInputSuccess();
          // goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount >= memo.allowedInputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            [
              'Ожидается ввод знака "минус" и адреса столбца, значения которого надо вычитать из результатов формулы',
              showHint && `(${substrCellName})`,
            ]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
    },
    [
      goToTheNextStep,
      memo.allowedInputErrorsCount,
      memo.errorsCount,
      memo.expectedValue,
      memo.inputErrorsCount,
      setErrorIncrement,
      setInputSuccess,
      step,
    ],
  );

  const handleEnter = React.useCallback(
    (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      ev.stopPropagation();
      const node = inputRef.current;
      if (node) {
        const text = normalizeInputString(node.value);
        const isCorrectValue = text === memo.expectedValue;
        if (step === ProgressSteps.StepFinishEquation) {
          if (isCorrectValue) {
            // node.blur();
            toast.success('Введена формула: "' + text + '".', defaultToastOptions);
            setInputSuccess();
            goToTheNextStep(successReactionDelay);
          } else {
            toast.error('Ожидается ввод закрывающей скобки.', defaultToastOptions);
          }
        }
        if (step === ProgressSteps.StepAddSubstrColumn) {
          if (isCorrectValue) {
            // node.blur();
            toast.success('Завершён ввод. Значение формулы: "' + text + '".', defaultToastOptions);
            goToTheNextStep(successReactionDelay);
          } else {
            toast.error(
              'Ожидается ввод знака "минус" и адреса столбца, значения которого надо вычитать из результатов формулы.',
              defaultToastOptions,
            );
          }
        }
      }
    },
    [goToTheNextStep, memo.expectedValue, setInputSuccess, step],
  );

  return (
    <TableCell
      {...rest}
      colIndex={colIndex}
      className={cn(
        isDev && '__TableInputCell', // DEBUG
        'border-2 border-solid',
        isInputSuccess ? 'border-green-500' : error ? 'border-red-500' : 'border-blue-500',
        'p-0',
        showDragHandler && 'cursor-crosshair',
        className,
      )}
      onClick={handleClick}
    >
      {hideInput && (
        <span>
          {/* Just render non-empty cell to prevent collpaing and keep tooltip at the bottom */}
          {isEquationFinal ? resultDataFinal[0] : resultDataRaw[0]}
        </span>
      )}
      <form
        className={cn(
          isDev && '__TableInputCell_Form', // DEBUG
          hideInput && 'invisible absolute',
          'relative',
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
            hideInput && 'invisible absolute',
          )}
          onInput={handleInput}
          autoComplete="off"
        />
      </form>
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
