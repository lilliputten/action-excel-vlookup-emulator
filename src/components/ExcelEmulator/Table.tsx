import React from 'react';

import { isDev } from '@/config';
import { cn } from '@/lib';

import { gridTemplateColumns, idDelim, rowsCount } from './constants/table';
import { getCellKey } from './helpers/getCellKey';
import { useProgressContext } from './ProgressContext';
import { TableRow } from './TableRow';

export function Table() {
  const { step, setStep, isFirstStep, isLastStep, stepIndex } = useProgressContext();

  React.useEffect(() => {
    console.log('[Table:ProgressContext]', {
      step,
      setStep,
      isFirstStep,
      isLastStep,
      stepIndex,
      gridTemplateColumns,
    });
  }, [step, setStep, isFirstStep, isLastStep, stepIndex]);

  const rows = Array.from(Array(rowsCount)).map((_none, rowIndex) => {
    const rowKey = getCellKey(rowIndex);
    const nodeKey = ['row', rowKey].map(String).join(idDelim);
    return <TableRow id={nodeKey} key={nodeKey} rowIndex={rowIndex} />;
  });

  return (
    <div
      className={cn(
        isDev && '__Table', // DEBUG
        'grid',
        // 'border-collapse',
        // 'table-fixed',
      )}
      style={{
        gridTemplateColumns,
        // borderSpacing: 0,
      }}
    >
      {rows}
    </div>
  );
}
