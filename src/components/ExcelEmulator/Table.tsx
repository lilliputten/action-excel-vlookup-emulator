import React from 'react';
import { toast } from 'react-toastify';

import { getCellName } from '@/lib/ExcelEmulator';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { ProgressNav } from '@/components/ProgressNav';
import { defaultToastOptions, isDev } from '@/config';
import { successReactionDelay } from '@/constants/ExcelEmulator';
import {
  gridTemplateColumns,
  idDelim,
  inputCellFieldId,
  inputCellName,
  rowsCount,
} from '@/constants/ExcelEmulator/table';
import { useProgressContext } from '@/contexts/ProgressContext';
import { defaultStepsValues, ProgressSteps } from '@/contexts/ProgressSteps';
import { useSelectionContext } from '@/contexts/SelectionContext';
import { cn } from '@/lib';

import { TableRow } from './TableRow';

function getCellNodeForEventTarget(target?: EventTarget | HTMLElement | null) {
  if (!target) {
    throw new Error('No target node specified');
  }
  let node: HTMLDivElement | null = target as HTMLDivElement;
  if (!node.dataset.cellName) {
    node = node.closest('div[data-cell-name]');
  }
  if (!node) {
    throw new Error('Can not find parent cell');
  }
  if (!node.dataset.cellName) {
    throw new Error('Can not find valid cell');
  }
  return node;
}

interface TMemo {
  /** Current step */
  step?: ProgressSteps;
  /** Input values per step starts */
  cachedInputs: Partial<Record<ProgressSteps, string>>;
  /** Inout field dom node */
  inputCellField?: HTMLInputElement | null;
}

export function Table() {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const progressContext = useProgressContext();
  const { step, setNextStep } = progressContext;

  const memo = React.useMemo<TMemo>(() => ({ cachedInputs: {} }), []);

  const selectionContext = useSelectionContext();
  const {
    finished,
    correct,
    selectionStart,
    selectionFinish,
    setSelecting,
    setFinished,
    setCorrect,
    setSelectionStart,
    setSelectionFinish,
  } = selectionContext;

  const {
    selectionStartCellName,
    selectionFinishCellName,
    onEnterMessage,
    selectionSuccessMessage,
    selectionErrorMessage,
  } = useStepData();
  const [canGoForward, setCanGoForward] = React.useState(false);

  React.useEffect(() => {
    const inited = !!memo.inputCellField;
    const inputCellField =
      memo.inputCellField ||
      (memo.inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null);
    if (!inited && inputCellField) {
      inputCellField.value = defaultStepsValues[step] || '';
    }
    // Update memo
    if (memo.step != step) {
      const cachedInputs = memo.cachedInputs;
      const prevStep = memo.step || ProgressSteps.StepStart;
      const nextStep = (step + 1) as ProgressSteps;
      const isForward = step >= prevStep;
      const canGoForward = !isForward || cachedInputs[nextStep] != undefined;
      /* // DEBUG
       * // eslint-disable-next-line no-console
       * console.log('[Table:Effect] step changed', {
       *   isForward,
       *   canGoForward,
       *   inputCellField,
       *   prevStep,
       *   step,
       *   nextStep,
       *   cachedInputs,
       *   memo,
       *   defaultStepsValues,
       * });
       */
      if (isForward) {
        cachedInputs[step] = inputCellField?.value || '';
      } else if (step < prevStep && inputCellField) {
        // Go back
        inputCellField.value = cachedInputs[step] || defaultStepsValues[step] || '';
      }
      // Can go forward if there was a step back
      setCanGoForward(canGoForward);
      memo.step = step;
    }
    // Show on enter message if defined
    if (onEnterMessage) {
      toast.info(onEnterMessage, defaultToastOptions);
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
    setNextStep();
  }, [memo, setNextStep]);

  const isSelecting =
    step === ProgressSteps.StepSelectLookupRange ||
    step === ProgressSteps.StepExtendRawResults ||
    step === ProgressSteps.StepExtendFinalResults;

  React.useEffect(() => {
    if (finished && correct) {
      if (isSelecting) {
        setFinished(false);
        setCorrect(false);
        setSelecting(false);
        setTimeout(setNextStep, successReactionDelay);
      }
    }
  }, [
    memo,
    isSelecting,
    finished,
    correct,
    selectionStart,
    selectionFinish,
    setNextStep,
    setFinished,
    setCorrect,
    setSelecting,
  ]);

  // Handle range selection
  React.useEffect(() => {
    const node = nodeRef.current;
    if (isSelecting && node) {
      const inputCellField = memo.inputCellField;
      const isSelectLookupRange = memo.step === ProgressSteps.StepSelectLookupRange;
      let selecting = false;
      let isCorrectStartCell = false;
      let startCellName = '';
      let finishCellName = '';
      let isCorrectCells = false;
      const handleStart = (ev: MouseEvent) => {
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
      const handleMouseMove = (ev: MouseEvent) => {
        if (selecting) {
          const cellNode = getCellNodeForEventTarget(ev.target);
          const cellName = cellNode.dataset.cellName || '';
          isCorrectCells = isCorrectStartCell && cellName === selectionFinishCellName;
          setSelectionFinish(cellNode);
          finishCellName = cellName;
          setCorrect(isCorrectCells);
          if (isSelectLookupRange && inputCellField) {
            inputCellField.value = inputCellField.value.replace(/:.*?$/, ':' + cellName);
          }
        }
      };
      /** Cancel selection */
      const handleCancel = () => {
        if (selecting) {
          // console.log('[Table:Effect:isSelecting] mouseout');
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
          // console.log('[Table:Effect:isSelecting] mouseup');
          if (isCorrectCells) {
            selecting = false;
            setSelecting(selecting);
            setFinished(true);
            toast.success(
              selectionSuccessMessage || 'Выделен диапазон: ' + range + '.',
              defaultToastOptions,
            );
          } else {
            toast.error(
              selectionErrorMessage || 'Выделен неверный диапазон: ' + range + '.',
              defaultToastOptions,
            );
            handleCancel();
          }
        }
      };
      node.addEventListener('mousedown', handleStart);
      node.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDone);
      document.addEventListener('mouseleave', handleCancel);
      return () => {
        node.removeEventListener('mousedown', handleStart);
        node.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleDone);
        document.removeEventListener('mouseleave', handleCancel);
      };
    }
  }, [
    memo,
    isSelecting,
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
