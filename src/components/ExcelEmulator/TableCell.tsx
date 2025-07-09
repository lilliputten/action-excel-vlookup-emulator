import { getCellName, getColName } from '@/lib/ExcelEmulator';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import {
  cellSpecs,
  genericColSpecs,
  mainColSpecs,
  mainRowSpecs,
} from '@/constants/ExcelEmulator/specs';
import {
  auxTableFirstCol,
  auxTableFirstRow,
  colsCount,
  mainTableFirstCol,
  mainTableFirstRow,
} from '@/constants/ExcelEmulator/table';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { checkIfAuxTableCell } from './helpers/checkIfAuxTableCell';
import { checkIfMainTableCell } from './helpers/checkIfMainTableCell';
import { getTableCellContent } from './helpers/getTableCellContent';
import { TOptionalColSpec } from './TColSpec';
import { ToolTip } from './ToolTip';

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
  const { hintCellName, hintCelClassName } = useStepData();
  const colName = getColName(colIndex);
  const cellKey = getCellName(rowIndex, colIndex);
  const isMainTableCell = checkIfMainTableCell(rowIndex, colIndex);
  const isAuxTableCell = checkIfAuxTableCell(rowIndex, colIndex);
  const mainRowSpec: TOptionalColSpec = isMainTableCell ? mainRowSpecs[rowIndex] : undefined;
  const genericColSpec: TOptionalColSpec = genericColSpecs[colName];
  const mainColSpec: TOptionalColSpec = isMainTableCell ? mainColSpecs[colName] : undefined;
  const cellSpec: TOptionalColSpec = cellSpecs[cellKey];
  const content = children || getTableCellContent(rowIndex, colIndex);
  const hasHint = cellKey === hintCellName;
  return (
    <div
      id={id}
      data-col-index={colIndex}
      data-row-index={rowIndex}
      className={cn(
        isDev && '__TableCell', // DEBUG
        'relative',
        'px-1 py-[2px]',
        'cursor-default bg-white',
        'before:pointer-events-none before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-[5] before:content-[""]',
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
