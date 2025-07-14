import React from 'react';
import { toast } from 'react-toastify';

import { getCellName } from '@/lib/ExcelEmulator';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { ProgressNav } from '@/components/ProgressNav';
import { defaultToastOptions, isDev } from '@/config';
import { helpMessageDelay, successReactionDelay } from '@/constants/ExcelEmulator';
import {
  gridTemplateColumns,
  idDelim,
  inputCellFieldId,
  inputCellName,
  rowsCount,
} from '@/constants/ExcelEmulator/table';
import { useFireworksContext } from '@/contexts/FireworksContext';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps, progressStepsCount } from '@/contexts/ProgressSteps';
import { useSelectionContext } from '@/contexts/SelectionContext';
import { cn } from '@/lib';

import { getCellNodeForEventTarget } from './helpers/getCellNodeForEventTarget';
import { TableRow } from './TableRow';

interface TMemo {
  /** Current step */
  step?: ProgressSteps;
  /** Input values per step starts */
  cachedInputs: Partial<Record<ProgressSteps, string>>;
  /** Inout field dom node */
  inputCellField?: HTMLInputElement | null;
  /** X and Y postioins for the fireworks effect */
  x?: number;
  y?: number;
}

/** Amount of wrong selections before a tip */
const wrongSelectionsLimit = 2;

export function Table() {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const { startFireworks } = useFireworksContext();

  const { step, setNextStep } = useProgressContext();

  const memo = React.useMemo<TMemo>(() => ({ cachedInputs: {} }), []);

  const {
    // selecting: isSelecting,
    finished,
    correct,
    selectionStart,
    selectionFinish,
    setSelecting,
    setFinished,
    setCorrect,
    setSelectionStart,
    setSelectionFinish,
    setWrongClicksCount,
  } = useSelectionContext();

  const {
    selectionStartCellName,
    selectionFinishCellName,
    onEnterMessage,
    selectionSuccessMessage,
    selectionErrorMessage,
    clickCellName,
  } = useStepData();
  const [canGoForward, setCanGoForward] = React.useState(false);

  const isSelectingStep =
    step === ProgressSteps.StepSelectLookupRange ||
    step === ProgressSteps.StepExtendRawResults ||
    step === ProgressSteps.StepExtendFinalResults;

  React.useEffect(() => {
    // Reset clicks count once (for each `TableCell` click checking)
    if (clickCellName) {
      setWrongClicksCount(0);
    }
  }, [clickCellName, setWrongClicksCount, step]);

  React.useEffect(() => {
    const inputCellField =
      memo.inputCellField ||
      (memo.inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null);
    // Update memo
    if (memo.step != step) {
      if (step === ProgressSteps.StepDone) {
        // Final step
        toast.success('Поздравляем! Все задачи выполены!', defaultToastOptions);
      }
      const cachedInputs = memo.cachedInputs;
      const prevStep = memo.step || ProgressSteps.StepStart;
      const nextStep = (step + 1) as ProgressSteps;
      const isForward = step >= prevStep;
      const canGoForward = !isForward || cachedInputs[nextStep] != undefined;
      if (isForward) {
        cachedInputs[step] = inputCellField?.value || '';
      }
      // Can go forward if there was a step back
      setCanGoForward(canGoForward);
      memo.step = step;
    }
    // Show on enter message if defined
    if (onEnterMessage) {
      toast.info(onEnterMessage, { ...defaultToastOptions, autoClose: helpMessageDelay });
    }
  }, [memo, step, onEnterMessage]);

  const handleGoForward = React.useCallback(() => {
    const inputCellField = memo.inputCellField;
    const currStep = memo.step || ProgressSteps.StepStart;
    const nextStep = (currStep + 1) as ProgressSteps;
    const futureStep = (currStep + 2) as ProgressSteps;
    const cachedInputs = memo.cachedInputs;
    const nextValue = cachedInputs[nextStep];
    const canGoForward = cachedInputs[futureStep] != undefined;
    if (inputCellField && nextValue != undefined) {
      inputCellField.value = nextValue;
    }
    setCanGoForward(canGoForward);
    // debugger;
    // startFireworks({ x: memo.x, y: memo.x });
    setNextStep();
  }, [memo, setNextStep]);

  React.useEffect(() => {
    if (finished && correct) {
      if (isSelectingStep) {
        setFinished(false);
        setCorrect(false);
        setSelecting(false);
        const step = memo.step || 0;
        const isContinuous = step + 1 === progressStepsCount - 1;
        startFireworks({ x: memo.x, y: memo.y, isContinuous });
        setTimeout(setNextStep, successReactionDelay);
      }
    }
  }, [
    memo,
    isSelectingStep,
    finished,
    correct,
    selectionStart,
    selectionFinish,
    setNextStep,
    setFinished,
    setCorrect,
    setSelecting,
    startFireworks,
  ]);

  // Handle range selection
  React.useEffect(() => {
    const node = nodeRef.current;
    if (isSelectingStep && node) {
      const inputCellField = memo.inputCellField;
      const isSelectLookupRange = memo.step === ProgressSteps.StepSelectLookupRange;
      let wrongSelectionsCount = 0;
      let selecting = false;
      let isCorrectStartCell = false;
      let startCellName = '';
      let finishCellName = '';
      let isCorrectCells = false;
      const handleStart = (ev: MouseEvent | TouchEvent) => {
        const cellNode = getCellNodeForEventTarget(ev.target);
        const cellName = cellNode.dataset.cellName || '';
        if (isSelectLookupRange && cellName === inputCellName) {
          // Don't react if input node clicked on StepSelectLookupRange
          return;
        }
        isCorrectStartCell = cellName === selectionStartCellName;
        if (isSelectLookupRange && inputCellField) {
          if (!inputCellField.value.trim().endsWith(';')) {
            inputCellField.value += ';';
          }
          inputCellField.value += cellName + ':' + cellName;
        }
        finishCellName = startCellName = cellName;
        selecting = true;
        setFinished(false);
        setSelecting(selecting);
        setSelectionStart(cellNode);
        setSelectionFinish(cellNode);
      };
      const handleMouseMove = (ev: MouseEvent | TouchEvent) => {
        if (selecting) {
          const x = ev instanceof TouchEvent ? ev.changedTouches[0].clientX : ev.clientX;
          const y = ev instanceof TouchEvent ? ev.changedTouches[0].clientY : ev.clientY;
          const isTouchEvent = ev instanceof TouchEvent;
          const target = isTouchEvent ? document.elementFromPoint(x, y) : ev.target;
          const cellNode = getCellNodeForEventTarget(target);
          const cellName = cellNode.dataset.cellName || '';
          isCorrectCells = isCorrectStartCell && cellName === selectionFinishCellName;
          setSelectionFinish(cellNode);
          finishCellName = cellName;
          setCorrect(isCorrectCells);
          memo.x = x;
          memo.y = y;
          if (isSelectLookupRange && inputCellField) {
            inputCellField.value = inputCellField.value.replace(/:.*?$/, ':' + cellName);
          }
          if (isTouchEvent && isCorrectStartCell) {
            ev.preventDefault();
          }
        }
      };
      /** Cancel selection */
      const handleCancel = () => {
        if (selecting) {
          selecting = false;
          setSelecting(selecting);
          setSelectionStart(undefined);
          setSelectionFinish(undefined);
          if (isSelectLookupRange && inputCellField) {
            inputCellField.value = inputCellField.value.replace(/;.*?$/, ';');
          }
        }
      };
      /** Finish selection */
      const handleDone = () => {
        if (selecting) {
          const range = [startCellName, finishCellName].filter(Boolean).join(':');
          if (isCorrectCells) {
            selecting = false;
            setSelecting(selecting);
            setFinished(true);
            toast.success(
              selectionSuccessMessage || 'Выделен диапазон: ' + range + '.',
              defaultToastOptions,
            );
          } else {
            const showTip = ++wrongSelectionsCount > wrongSelectionsLimit;
            toast.error(
              selectionErrorMessage || 'Выделен неверный диапазон: ' + range + '.',
              defaultToastOptions,
            );
            if (showTip) {
              toast.info(
                'Выберите диапазон ' + selectionStartCellName + ':' + selectionFinishCellName + '.',
                defaultToastOptions,
              );
            }
            handleCancel();
          }
        }
      };
      node.addEventListener('mousedown', handleStart);
      node.addEventListener('touchstart', handleStart);
      node.addEventListener('mousemove', handleMouseMove);
      node.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('mouseleave', handleCancel);
      document.addEventListener('mouseup', handleDone);
      document.addEventListener('touchend', handleDone);
      return () => {
        node.removeEventListener('mousedown', handleStart);
        node.removeEventListener('touchstart', handleStart);
        node.removeEventListener('mousemove', handleMouseMove);
        node.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('mouseleave', handleCancel);
        document.removeEventListener('mouseup', handleDone);
        document.removeEventListener('touchend', handleDone);
      };
    }
  }, [
    memo,
    isSelectingStep,
    nodeRef,
    setSelecting,
    setSelectionStart,
    setSelectionFinish,
    selectionStartCellName,
    selectionFinishCellName,
    selectionSuccessMessage,
    selectionErrorMessage,
    setCorrect,
    setFinished,
  ]);

  const rows = React.useMemo(() => {
    return Array.from(Array(rowsCount)).map((_none, rowIndex) => {
      const rowKey = getCellName(rowIndex);
      const nodeKey = ['row', rowKey].map(String).join(idDelim);
      return <TableRow id={nodeKey} key={nodeKey} rowIndex={rowIndex} />;
    });
  }, []);

  return (
    <div
      ref={nodeRef}
      className={cn(
        isDev && '__TableWrapper', // DEBUG
      )}
    >
      <div
        ref={nodeRef}
        className={cn(
          isDev && '__Table', // DEBUG
          'grid select-none',
        )}
        style={{
          gridTemplateColumns,
        }}
      >
        {rows}
      </div>
      <ProgressNav
        canGoForward={canGoForward}
        onGoForward={handleGoForward}
        helpMessage={onEnterMessage}
      />
    </div>
  );
}
