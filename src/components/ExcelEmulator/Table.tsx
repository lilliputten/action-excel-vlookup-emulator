import React from 'react';
import { toast } from 'react-toastify';

import { getCellName } from '@/lib/ExcelEmulator';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
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
import { ProgressSteps } from '@/contexts/ProgressSteps';
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
  step?: ProgressSteps;
}

export function Table() {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const progressContext = useProgressContext();
  const { step, setNextStep } = progressContext;

  const memo = React.useMemo<TMemo>(() => ({}), []);

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

  const { selectionStartCellName, selectionFinishCellName, onEnterMessage } = useStepData();

  React.useEffect(() => {
    // Update memo
    if (memo.step != step) {
      const prevStep = memo.step;
      // eslint-disable-next-line no-console
      console.log('[Table:Effect] step changed', {
        prevStep,
        step,
      });
      memo.step = step;
      // TODO: To fix data, eg if previous step has been chosen?
    }
    // Show on enter message if defined
    if (onEnterMessage) {
      toast.info(onEnterMessage, defaultToastOptions);
    }
  }, [memo, step, onEnterMessage]);

  React.useEffect(() => {
    if (finished && correct) {
      const isSelectLookupRange = memo.step === ProgressSteps.StepSelectLookupRange;
      if (isSelectLookupRange) {
        const inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null;
        inputCellField?.focus();
        setFinished(false);
        setCorrect(false);
        setSelecting(false);
        setTimeout(setNextStep, successReactionDelay);
      }
    }
  }, [
    memo,
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
    const isSelectLookupRange = memo.step === ProgressSteps.StepSelectLookupRange;
    if (isSelectLookupRange && node) {
      const inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null;
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
        if (inputCellField) {
          if (!inputCellField.value.trim().endsWith(';')) {
            inputCellField.value += ';';
          }
          inputCellField.value += cellName + ':' + cellName;
          finishCellName = startCellName = cellName;
        }
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
          if (inputCellField) {
            inputCellField.value = inputCellField.value.replace(/:.*?$/, ':' + cellName);
          }
        }
      };
      /** Cancel selection */
      const handleCancel = () => {
        if (selecting) {
          // console.log('[Table:Effect:isSelectLookupRange] mouseout');
          selecting = false;
          setSelecting(selecting);
          setSelectionStart(undefined);
          setSelectionFinish(undefined);
          if (inputCellField) {
            inputCellField.value = inputCellField.value.replace(/;.*?$/, ';');
          }
        }
      };
      /** Finish selection */
      const handleDone = () => {
        if (selecting) {
          const range = [startCellName, finishCellName].filter(Boolean).join(':');
          // console.log('[Table:Effect:isSelectLookupRange] mouseup');
          if (isCorrectCells) {
            selecting = false;
            setSelecting(selecting);
            setFinished(true);
            toast.success('Выделен диапазон: ' + range, defaultToastOptions);
          } else {
            toast.error('Выделен неверный диапазон: ' + range, defaultToastOptions);
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
    nodeRef,
    setSelecting,
    setSelectionStart,
    setSelectionFinish,
    selectionStartCellName,
    selectionFinishCellName,
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
        isDev && '__Table', // DEBUG
        'grid select-none',
      )}
      style={{
        gridTemplateColumns,
      }}
    >
      {rows}
    </div>
  );
}
