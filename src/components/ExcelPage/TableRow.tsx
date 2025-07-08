import { isDev } from '@/config';
import { cn } from '@/lib';

import { cellSpecs } from './constants/specs';
import { colsCount, idDelim } from './constants/table';
import { getCellKey } from './helpers/getCellKey';
import { TableCell } from './TableCell';
import { TableSideRulerCell } from './TableSideRulerCell';
import { TableTopRulerCell } from './TableTopRulerCell';
import { TTableRowProps } from './types/propTypes';

export function TableRow(props: TTableRowProps) {
  const { id, className, rowIndex } = props;
  const cols: React.JSX.Element[] = [];
  for (let colIndex = 0; colIndex < colsCount; colIndex++) {
    const key = getCellKey(rowIndex, colIndex);
    const spanCount = cellSpecs[key]?.colSpan;
    const nodeKey = ['cell', key].map(String).join(idDelim);
    const Cell = !rowIndex ? TableTopRulerCell : !colIndex ? TableSideRulerCell : TableCell;
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
  return (
    <tr
      id={id}
      data-row-index={rowIndex}
      className={cn(
        isDev && '__TableRow', // DEBUG
      )}
    >
      {cols}
    </tr>
  );
}
