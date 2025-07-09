import { getCellName } from '@/lib/ExcelEmulator';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import { cellSpecs } from '@/constants/ExcelEmulator/specs';
import { colsCount, idDelim, inputCellName, sourceCellName } from '@/constants/ExcelEmulator/table';
import { cn } from '@/lib';
import { TTableRowProps } from '@/types/ExcelEmulator/cellPropTypes';

import { TableCell } from './TableCell';
import { TableHintCell } from './TableHintCell';
import { TableInputCell } from './TableInputCell';
import { TableSideRulerCell } from './TableSideRulerCell';
import { TableSourceCell } from './TableSourceCell';
import { TableTopRulerCell } from './TableTopRulerCell';

export function TableRow(props: TTableRowProps) {
  const { className, rowIndex } = props;
  const cols: React.JSX.Element[] = [];
  const { hintCellName } = useStepData();
  for (let colIndex = 0; colIndex < colsCount; colIndex++) {
    const cellKey = getCellName(rowIndex, colIndex);
    const spanCount = cellSpecs[cellKey]?.colSpan;
    const nodeKey = ['cell', cellKey].map(String).join(idDelim);
    let Cell = TableCell;
    if (!rowIndex) {
      Cell = TableTopRulerCell;
    } else if (!colIndex) {
      Cell = TableSideRulerCell;
    } else if (cellKey === inputCellName) {
      Cell = TableInputCell;
    } else if (cellKey === sourceCellName) {
      Cell = TableSourceCell;
    } else if (cellKey === hintCellName) {
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
