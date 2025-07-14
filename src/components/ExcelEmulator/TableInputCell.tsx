import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useLanguage } from '@/config/lang';
import { defaultToastOptions, isDev } from '@/config';
import {
  editedLookupRangeName,
  expectedColumnNumber,
  expectedIntervalValue,
  inputCellFieldId,
  lookupRangeName,
  resultDataFinal,
  resultDataRaw,
  sourceCellName,
  substrCellName,
  successReactionDelay,
} from '@/constants/ExcelEmulator';
import { useFireworksContext } from '@/contexts/FireworksContext';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps, useExpectedStepValue, useInitialStepValue } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { getCursorCoordinates } from './helpers/getCursorCoordinates';
import { TableCell } from './TableCell';
import { ToolTip } from './ToolTip';

function normalizeInputString(str: string) {
  return str.trim().replace(/\s+/g, '').toUpperCase();
}

interface TMemo {
  prevStep?: ProgressSteps;
  inputErrorsCount: number;
  errorsCount: number;
  expectedValue?: string;
}

export function TableInputCell(props: TTableCellProps) {
  const { t } = useTranslation();
  const lng = useLanguage();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isInputSuccess, setIsInputSuccess] = React.useState(false);
  const { startFireworks } = useFireworksContext();
  const { className, colIndex, ...rest } = props;
  const { step, setNextStep } = useProgressContext();
  const expectedValue = useExpectedStepValue(step, lng);
  const currentValue = useInitialStepValue(step, lng);
  const memo = React.useMemo<TMemo>(
    () => ({
      // Default memo values
      inputErrorsCount: 0,
      errorsCount: 0,
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
    memo.prevStep = step;
    const inputCellField = inputRef.current;
    memo.inputErrorsCount = 0;
    memo.errorsCount = 0;
    memo.expectedValue = expectedValue;
    if (inputCellField) {
      inputCellField.value = currentValue;
      setError(undefined);
      setIsInputSuccess(false);
    }
  }, [step, memo, inputRef, expectedValue, currentValue]);

  // Specific keystroke reader (F4 for StepEditLookupRange)
  React.useEffect(() => {
    const inputCellField = inputRef.current;
    // Detect F4 press for equation edit (while wait for adding of '$' signs)
    if (step === ProgressSteps.StepEditLookupRange && inputCellField) {
      const detectF4 = (ev: KeyboardEvent) => {
        if (ev.key === 'F4') {
          const value = memo.expectedValue;
          if (value) {
            inputCellField.value = value;
            toast.success(
              t('zakreplyon-diapazon') + editedLookupRangeName + '.',
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
  }, [step, inputRef, goToTheNextStep, memo, t]);

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
      const expectedValue = memo.expectedValue || '';
      const isCorrectValue = text === expectedValue;
      const isPartialValue = isCorrectValue || expectedValue.startsWith(text);
      if (isInputSuccess) {
        node.value = expectedValue;
        return;
      }
      if (!isPartialValue) {
        memo.inputErrorsCount++;
      }
      const showHint = memo.errorsCount >= 2;
      const showNextHint = memo.errorsCount >= 4;
      if (step === ProgressSteps.StepEquationStart) {
        const __debugQuickEquation = false;
        if (__debugQuickEquation && isDev ? !!text : isCorrectValue) {
          node.value = expectedValue;
          // node.blur();
          toast.success(t('vvedeno-nachalo-formuly'), defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            [
              t('ozhidaetsya-vvod-formuly'),
              showHint &&
                (showNextHint
                  ? t('v-dannom-sluchae-vvodite-expectedvalue', { expectedValue })
                  : t('formuly-v-excel-nachinayutsya-so-znaka-za-kotorym-sleduet')),
            ]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
      if (step === ProgressSteps.StepEquationDelim) {
        if (isCorrectValue) {
          toast.success(t('dobavlen-razdelitel'), defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            [t('ozhidaetsya-vvod-razdelitelya'), showHint && t('delimiter-description')]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
      if (step === ProgressSteps.StepSelectSourceColumn) {
        if (isCorrectValue) {
          toast.success(t('vybran-iskhodnyi-stolbec') + sourceCellName, defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(t('ozhidaetsya-vvod-adres-iskhodnogo-stolbca-dlya-poiska'));
        }
      }
      if (step === ProgressSteps.StepSelectLookupRange) {
        if (isCorrectValue) {
          // Wait for ';E6:H16'
          toast.success(t('vvedyon-diapazon') + lookupRangeName, defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(t('ozhidaetsya-vvod-diapazona-yacheek'));
        }
      }
      if (step === ProgressSteps.StepEditLookupRange) {
        // Wait for ';$E$6:$H$16'
        if (isCorrectValue) {
          toast.success(
            t('zakreplyon-diapazon') + editedLookupRangeName + '.',
            defaultToastOptions,
          );
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(t('dobavte-znaki-dollara-vokrug-adresov'));
        }
      }
      if (step === ProgressSteps.StepAddColumnNumber) {
        if (isCorrectValue) {
          toast.success(t('vvedyon-nomer-stolbca') + expectedColumnNumber, defaultToastOptions);
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            [t('vvedite-nomer-stolbca'), showHint && `(${expectedColumnNumber})`]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
      if (step === ProgressSteps.StepAddInterval) {
        if (isCorrectValue) {
          toast.success(
            t('vvedeno-znachenie-intervalnogo-prosmotra') + expectedIntervalValue,
            defaultToastOptions,
          );
          goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            [
              t('vvedite-znachenie-intervalnogo-prosmotra'),
              showHint && `(${expectedIntervalValue})`,
            ]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
      if (step === ProgressSteps.StepFinishEquation) {
        if (isCorrectValue) {
          toast.success(t('zavershyon-vvod-formuly-teper-nazhmite-enter'), defaultToastOptions);
          setInputSuccess();
          // goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(t('vvedite-zakryvayushuyu-skobku'));
        }
      }
      if (step === ProgressSteps.StepAddSubstrColumn) {
        if (isCorrectValue) {
          toast.success(
            t('vvedyon-adres-stolbca-dlya-vychitaniya') +
              substrCellName +
              t('teper-nazhmite-enter'),
            defaultToastOptions,
          );
          setInputSuccess();
          // goToTheNextStep(successReactionDelay);
        } else if (memo.inputErrorsCount || memo.errorsCount) {
          setErrorIncrement(
            [t('ozhidaetsya-vvod-znaka-minus-i-adresa-stolbca'), showHint && `(${substrCellName})`]
              .filter(Boolean)
              .join(' '),
          );
        }
      }
    },
    [goToTheNextStep, memo, setErrorIncrement, setInputSuccess, step, t, isInputSuccess],
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
            toast.success(t('vvedena-formula') + text + '.', defaultToastOptions);
            setInputSuccess();
            goToTheNextStep(successReactionDelay);
          } else {
            toast.error(t('ozhidaetsya-vvod-zakryvayushei-skobki'), defaultToastOptions);
          }
        }
        if (step === ProgressSteps.StepAddSubstrColumn) {
          if (isCorrectValue) {
            // node.blur();
            toast.success(t('zavershyon-vvod-znachenie-formuly') + text + '.', defaultToastOptions);
            goToTheNextStep(successReactionDelay);
          } else {
            toast.error(t('ozhidaetsya-vvod-znaka-minus-i-adresa-stolbca'), defaultToastOptions);
          }
        }
      }
    },
    [goToTheNextStep, memo.expectedValue, setInputSuccess, step, t],
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
            isInputSuccess && 'pointer-events-none',
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
