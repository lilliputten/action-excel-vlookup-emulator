import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import { cn } from '@/lib';

import { cellSpecs } from './constants/specs';
import { colsCount, idDelim, inputCellKey, sourceCellKey } from './constants/table';
import { getCellKey } from './helpers/getCellKey';
import { TableCell } from './TableCell';
import { TableHintCell } from './TableHintCell';
import { TableInputCell } from './TableInputCell';
import { TableSideRulerCell } from './TableSideRulerCell';
import { TableSourceCell } from './TableSourceCell';
import { TableTopRulerCell } from './TableTopRulerCell';
import { TTableRowProps } from './types/propTypes';

export function TableRow(props: TTableRowProps) {
  const { className, rowIndex } = props;
  const cols: React.JSX.Element[] = [];
  const { hintCellKey } = useStepData();
  for (let colIndex = 0; colIndex < colsCount; colIndex++) {
    const cellKey = getCellKey(rowIndex, colIndex);
    const spanCount = cellSpecs[cellKey]?.colSpan;
    const nodeKey = ['cell', cellKey].map(String).join(idDelim);
    let Cell = TableCell;
    if (!rowIndex) {
      Cell = TableTopRulerCell;
    } else if (!colIndex) {
      Cell = TableSideRulerCell;
    } else if (cellKey === inputCellKey) {
      Cell = TableInputCell;
    } else if (cellKey === sourceCellKey) {
      Cell = TableSourceCell;
    } else if (cellKey === hintCellKey) {
      Cell = TableHintCell;
    }
    cols.push(
      <Cell
        key={nodeKey}
        id={nodeKey}
        data-row-index={rowIndex}
        spanCount={spanCount}
        rowIndex={rowIndex}
        colIndex={colIndex}
        className={cn(
          isDev && '__TableRow', // DEBUG
          className,
        )}
      />,
    );
    if (spanCount) {
      colIndex += spanCount - 1;
    }
  }
  return <>{cols}</>;
}
