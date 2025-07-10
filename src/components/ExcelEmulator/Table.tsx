import React from 'react';

import { getCellName } from '@/lib/ExcelEmulator';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import {
  gridTemplateColumns,
  idDelim,
  inputCellFieldId,
  rowsCount,
} from '@/constants/ExcelEmulator/table';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { useSelectionContext } from '@/contexts/SelectionContext';
import { cn } from '@/lib';

import { TableRow } from './TableRow';

export function Table() {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const progressContext = useProgressContext();
  const { step, setNextStep } = progressContext;

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

  const { hintCellName, finishCellName } = useStepData();

  React.useEffect(() => {
    if (finished && correct) {
      const isSelectLookupRange = step === ProgressSteps.StepSelectLookupRangeStart;
      if (isSelectLookupRange) {
        const inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null;
        inputCellField?.focus();
        setFinished(false);
        setCorrect(false);
        setSelecting(false);
        setNextStep();
      }
    }
  }, [
    step,
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
    const isSelectLookupRange = step === ProgressSteps.StepSelectLookupRangeStart;
    if (isSelectLookupRange && node) {
      const inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null;
      let selecting = false;
      let isFinishCell = false;
      const handleStart = (ev: MouseEvent) => {
        const cellNode = ev.target as HTMLDivElement;
        const cellName = cellNode.dataset.cellName;
        const isHintCell = cellName === hintCellName;
        if (isHintCell) {
          if (inputCellField) {
            if (!inputCellField.value.trim().endsWith(';')) {
              inputCellField.value += ';';
            }
            inputCellField.value += cellName + ':' + cellName;
          }
          selecting = true;
          setFinished(false);
          setSelecting(selecting);
          setSelectionStart(cellNode);
          setSelectionFinish(cellNode);
        }
      };
      const handleMouseMove = (ev: MouseEvent) => {
        if (selecting) {
          const cellNode = ev.target as HTMLDivElement;
          const cellName = cellNode.dataset.cellName;
          isFinishCell = cellName === finishCellName;
          setSelectionFinish(cellNode);
          setCorrect(isFinishCell);
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
          // console.log('[Table:Effect:isSelectLookupRange] mouseup');
          if (isFinishCell) {
            selecting = false;
            setSelecting(selecting);
            setFinished(true);
          } else {
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
    step,
    nodeRef,
    setSelecting,
    setSelectionStart,
    setSelectionFinish,
    hintCellName,
    finishCellName,
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
