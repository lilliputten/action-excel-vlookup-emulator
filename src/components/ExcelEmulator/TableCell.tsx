import { isDev } from '@/config';
import { cn } from '@/lib';

import { cellSpecs, genericColSpecs, mainColSpecs, mainRowSpecs } from './constants/specs';
import { checkIfAuxTableCell } from './helpers/checkIfAuxTableCell';
import { checkIfMainTableCell } from './helpers/checkIfMainTableCell';
import { getCellKey } from './helpers/getCellKey';
import { getTableCellContent } from './helpers/getTableCellContent';
import { TOptionalColSpec } from './TColSpec';
import { TTableCellProps } from './types/propTypes';
import { getColName } from './utils/getColName';

export function TableCell(props: TTableCellProps) {
  const { children, onClick, className, id, rowIndex, colIndex, spanCount } = props;
  const colName = getColName(colIndex);
  const cellKey = getCellKey(rowIndex, colIndex);
  const isMainTableCell = checkIfMainTableCell(rowIndex, colIndex);
  const isAuxTableCell = checkIfAuxTableCell(rowIndex, colIndex);
  const mainRowSpec: TOptionalColSpec = isMainTableCell ? mainRowSpecs[rowIndex] : undefined;
  const genericColSpec: TOptionalColSpec = genericColSpecs[colName];
  const mainColSpec: TOptionalColSpec = isMainTableCell ? mainColSpecs[colName] : undefined;
  const cellSpec: TOptionalColSpec = cellSpecs[cellKey];
  const content = children || getTableCellContent(rowIndex, colIndex);
  return (
    <td
      id={id}
      data-row-index={rowIndex}
      data-col-index={colIndex}
      className={cn(
        isDev && '__TableCell', // DEBUG
        'px-1',
        isAuxTableCell && 'border border-solid border-gray-300',
        isMainTableCell && 'border border-solid border-black',
        isMainTableCell && 'whitespace-nowrap',
        isMainTableCell ? 'text-black' : 'text-gray-500',
        'bg-white',
        mainRowSpec?.className,
        genericColSpec?.className,
        mainColSpec?.className,
        cellSpec?.className,
        className,
      )}
      colSpan={spanCount}
      width={cellSpec?.width || genericColSpec?.width || mainColSpec?.width}
      onClick={onClick}
    >
      {content}
    </td>
  );
}
