import { isDev } from '@/config';
import { cn } from '@/lib';

import { gridTemplateColumns, idDelim, rowsCount } from './constants/table';
import { getCellKey } from './helpers/getCellKey';
import { TableRow } from './TableRow';

export function Table() {
  /* // DEBUG
   * const { step, setStep, isFirstStep, isLastStep, stepIndex } = useProgressContext();
   * React.useEffect(() => {
   *   console.log('[Table:ProgressContext]', {
   *     step,
   *     setStep,
   *     isFirstStep,
   *     isLastStep,
   *     stepIndex,
   *     gridTemplateColumns,
   *   });
   * }, [step, setStep, isFirstStep, isLastStep, stepIndex]);
   */

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
      )}
      style={{
        gridTemplateColumns,
      }}
    >
      {rows}
    </div>
  );
}
