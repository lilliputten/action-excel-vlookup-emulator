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
  colsCount,
  mainTableFirstCol,
  mainTableFirstRow,
  targetTableFirstCol,
  targetTableFirstRow,
} from '@/constants/ExcelEmulator/table';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { getTableCellContent } from './helpers/getTableCellContent';
import { isCellInLookupTable } from './helpers/isCellInLookupTable';
import { isCellInMainTable } from './helpers/isCellInMainTable';
import { isCellInTargetTable } from './helpers/isCellInTargetTable';
import { TOptionalColSpec } from './TColSpec';
import { ToolTip } from './ToolTip';

function isInnerTableCol(rowIndex: number, colIndex: number) {
  const isMainTableCell = isCellInMainTable(rowIndex, colIndex);
  const isAuxTableCell = isCellInTargetTable(rowIndex, colIndex);
  if (isMainTableCell && colIndex !== mainTableFirstCol) {
    return true;
  }
  if (isAuxTableCell && colIndex !== targetTableFirstCol) {
    return true;
  }
  return false;
}

function isInnerTableRow(rowIndex: number, colIndex: number) {
  const isMainTableCell = isCellInMainTable(rowIndex, colIndex);
  const isAuxTableCell = isCellInTargetTable(rowIndex, colIndex);
  if (isMainTableCell && rowIndex !== mainTableFirstRow) {
    return true;
  }
  if (isAuxTableCell && rowIndex !== targetTableFirstRow) {
    return true;
  }
  return false;
}

export function TableCell(props: TTableCellProps) {
  const { children, onClick, className, id, rowIndex, colIndex, spanCount, style } = props;
  const { step } = useProgressContext();
  const isStepSelectTargetRange = step === ProgressSteps.StepSelectTargetRange;
  const { hintCellName, hintCelClassName } = useStepData();
  const colName = getColName(colIndex);
  const cellName = getCellName(rowIndex, colIndex);
  const showLookup = isStepSelectTargetRange && isCellInLookupTable(rowIndex, colIndex);
  const isMainTableCell = isCellInMainTable(rowIndex, colIndex);
  const isAuxTableCell = isCellInTargetTable(rowIndex, colIndex);
  const mainRowSpec: TOptionalColSpec = isMainTableCell ? mainRowSpecs[rowIndex] : undefined;
  const genericColSpec: TOptionalColSpec = genericColSpecs[colName];
  const mainColSpec: TOptionalColSpec = isMainTableCell ? mainColSpecs[colName] : undefined;
  const cellSpec: TOptionalColSpec = cellSpecs[cellName];
  const content = children || getTableCellContent(rowIndex, colIndex);
  const hasHint = cellName === hintCellName;
  return (
    <div
      id={id}
      data-cell-name={cellName}
      data-col-index={colIndex}
      data-row-index={rowIndex}
      className={cn(
        isDev && '__TableCell', // DEBUG
        'relative',
        'px-1 py-[2px]',
        'cursor-default bg-white',
        'before:pointer-events-none before:absolute before:top-0 before:right-0 before:bottom-0 before:left-0 before:z-[5] before:content-[""]',
        showLookup && 'animated-background',
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
