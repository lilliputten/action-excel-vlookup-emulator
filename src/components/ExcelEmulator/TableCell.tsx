import { getColName } from '@/lib/ExcelEmulator';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import { cn } from '@/lib';

import { cellSpecs, genericColSpecs, mainColSpecs, mainRowSpecs } from './constants/specs';
import {
  auxTableFirstCol,
  auxTableFirstRow,
  colsCount,
  mainTableFirstCol,
  mainTableFirstRow,
} from './constants/table';
import { checkIfAuxTableCell } from './helpers/checkIfAuxTableCell';
import { checkIfMainTableCell } from './helpers/checkIfMainTableCell';
import { getCellKey } from './helpers/getCellKey';
import { getTableCellContent } from './helpers/getTableCellContent';
import { TOptionalColSpec } from './TColSpec';
import { ToolTip } from './ToolTip';
import { TTableCellProps } from './types/propTypes';

function isInnerTableCol(rowIndex: number, colIndex: number) {
  const isMainTableCell = checkIfMainTableCell(rowIndex, colIndex);
  const isAuxTableCell = checkIfAuxTableCell(rowIndex, colIndex);
  if (isMainTableCell && colIndex !== mainTableFirstCol) {
    return true;
  }
  if (isAuxTableCell && colIndex !== auxTableFirstCol) {
    return true;
  }
  return false;
}

function isInnerTableRow(rowIndex: number, colIndex: number) {
  const isMainTableCell = checkIfMainTableCell(rowIndex, colIndex);
  const isAuxTableCell = checkIfAuxTableCell(rowIndex, colIndex);
  if (isMainTableCell && rowIndex !== mainTableFirstRow) {
    return true;
  }
  if (isAuxTableCell && rowIndex !== auxTableFirstRow) {
    return true;
  }
  return false;
}

export function TableCell(props: TTableCellProps) {
  const { children, onClick, className, id, rowIndex, colIndex, spanCount, style } = props;
  const { hintCellKey, hintCelClassName } = useStepData();
  const colName = getColName(colIndex);
  const cellKey = getCellKey(rowIndex, colIndex);
  const isMainTableCell = checkIfMainTableCell(rowIndex, colIndex);
  const isAuxTableCell = checkIfAuxTableCell(rowIndex, colIndex);
  const mainRowSpec: TOptionalColSpec = isMainTableCell ? mainRowSpecs[rowIndex] : undefined;
  const genericColSpec: TOptionalColSpec = genericColSpecs[colName];
  const mainColSpec: TOptionalColSpec = isMainTableCell ? mainColSpecs[colName] : undefined;
  const cellSpec: TOptionalColSpec = cellSpecs[cellKey];
  const content = children || getTableCellContent(rowIndex, colIndex);
  const hasHint = cellKey === hintCellKey;
  return (
    <div
      id={id}
      data-row-index={rowIndex}
      data-col-index={colIndex}
      className={cn(
        isDev && '__TableCell', // DEBUG
        'relative',
        'px-1 py-[2px]',
        'cursor-default bg-white',
        isAuxTableCell && 'border border-solid border-gray-300',
        isMainTableCell && 'border border-solid border-black',
        isMainTableCell && 'whitespace-nowrap',
        isMainTableCell ? 'text-black' : 'text-gray-500',
        isInnerTableRow(rowIndex, colIndex) && 'border-t-0',
        isInnerTableCol(rowIndex, colIndex) && 'border-l-0',
        mainRowSpec?.className,
        genericColSpec?.className,
        mainColSpec?.className,
        cellSpec?.className,
        hasHint && hintCelClassName,
        className,
      )}
      style={{
        ...style,
        gridColumn: spanCount && `span ${spanCount} / span ${colsCount}`,
      }}
      onClick={onClick}
    >
      {content}
      {hasHint && <ToolTip />}
    </div>
  );
}
