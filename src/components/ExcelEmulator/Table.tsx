import React from 'react';

import { isDev } from '@/config';
import { cn } from '@/lib';

import { idDelim, rowsCount } from './constants/table';
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
    });
  }, [step, setStep, isFirstStep, isLastStep, stepIndex]);

  const rows = Array.from(Array(rowsCount)).map((_none, rowIndex) => {
    const rowKey = getCellKey(rowIndex);
    const nodeKey = ['row', rowKey].map(String).join(idDelim);
    return <TableRow id={nodeKey} key={nodeKey} rowIndex={rowIndex} />;
  });

  return (
    <table
      className={cn(
        isDev && '__Table', // DEBUG
        'border-collapse',
        // 'table-fixed',
      )}
      style={{ borderSpacing: 0 }}
    >
      <tbody>{rows}</tbody>
    </table>
  );
}
