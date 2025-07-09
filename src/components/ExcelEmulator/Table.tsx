import React from 'react';

import { getCellName } from '@/lib/ExcelEmulator';
import { isDev } from '@/config';
import { gridTemplateColumns, idDelim, rowsCount } from '@/constants/ExcelEmulator/table';
import { TProgressContext, useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { useSelectionContext } from '@/contexts/SelectionContext';
import { cn } from '@/lib';

import { TableRow } from './TableRow';

interface TMemo {
  step?: TProgressContext['step'];
  // selecting?: boolean;
}

export function Table() {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const [localSelecting, setLocalSelecting] = React.useState(false);

  const progressContext = useProgressContext();
  const { step, setNextStep, setPrevStep } = progressContext;
  const isSelectLookupRange =
    step === ProgressSteps.StepSelectLookupRangeStart ||
    step === ProgressSteps.StepSelectLookupRangeFinish;

  const selectionContext = useSelectionContext();
  const { setSelecting, setFinished, setSelectionStart, setSelectionFinish } = selectionContext;

  const memo = React.useMemo<TMemo>(() => ({}), []);

  React.useEffect(() => {
    memo.step = step;
  }, [memo, step]);

  // React.useEffect(() => {
  //   memo.selecting = localSelecting;
  //   setSelecting(localSelecting);
  // }, [memo, setSelecting, localSelecting]);

  React.useEffect(() => {
    console.log('[] updated selectionContext', {
      setSelecting,
      setSelectionStart,
      setSelectionFinish,
    });
  }, [setSelecting, setSelectionStart, setSelectionFinish]);

  // Handle range selection
  React.useEffect(() => {
    const node = nodeRef.current;
    if (isSelectLookupRange && node) {
      let selecting = false;
      console.log('[Table:Effect:isSelectLookupRange]', {
        isSelectLookupRange,
        node,
      });
      const onMouseDown = (ev: MouseEvent) => {
        const cellNode = ev.target as HTMLDivElement;
        console.log('[Table:Effect:isSelectLookupRange] mousedown', {
          step: memo.step,
          cellNode,
        });
        selecting = true;
        setLocalSelecting(selecting);
        setSelecting(selecting);
        setSelectionStart(cellNode);
        setSelectionFinish(undefined);
        if (memo.step === ProgressSteps.StepSelectLookupRangeStart) {
          setNextStep();
        }
      };
      const onMouseMove = (ev: MouseEvent) => {
        if (selecting) {
          const cellNode = ev.target as HTMLDivElement;
          console.log('[Table:Effect:isSelectLookupRange] mousemove', {
            cellNode,
          });
          setSelectionFinish(cellNode);
        }
      };
      const onMouseUp = (ev: MouseEvent) => {
        if (selecting) {
          console.log('[Table:Effect:isSelectLookupRange] mouseup', {
            ev,
          });
          selecting = false;
          setLocalSelecting(selecting);
          setSelecting(selecting);
          // TODO: Finish selection?
          if (memo.step === ProgressSteps.StepSelectLookupRangeFinish) {
            setPrevStep();
          }
        }
      };
      const onMouseOut = () => {
        if (selecting) {
          console.log('[Table:Effect:isSelectLookupRange] mouseout');
          selecting = false;
          setLocalSelecting(selecting);
          setSelecting(selecting);
          setSelectionStart(undefined);
          setSelectionFinish(undefined);
          if (memo.step === ProgressSteps.StepSelectLookupRangeFinish) {
            setPrevStep();
          }
        }
      };
      node.addEventListener('mousedown', onMouseDown);
      node.addEventListener('mousemove', onMouseMove);
      node.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mouseleave', onMouseOut);
      return () => {
        node.removeEventListener('mousedown', onMouseDown);
        node.removeEventListener('mousemove', onMouseMove);
        node.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mouseleave', onMouseOut);
      };
    }
  }, [
    isSelectLookupRange,
    nodeRef,
    memo,
    setNextStep,
    setPrevStep,
    setSelecting,
    setSelectionStart,
    setSelectionFinish,
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
