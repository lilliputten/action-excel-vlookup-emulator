import React from 'react';
import { toast } from 'react-toastify';

import { getCellName, getColName } from '@/lib/ExcelEmulator';
import { useIsCellInSelection } from '@/hooks/ExcelEmulator/useIsCellInSelection';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { defaultToastOptions, isDev } from '@/config';
import { successReactionDelay } from '@/constants/ExcelEmulator';
import {
  cellSpecs,
  genericColSpecs,
  mainColSpecs,
  mainRowSpecs,
} from '@/constants/ExcelEmulator/specs';
import {
  colsCount,
  inputCellFieldId,
  inputCellName,
  substrCellName,
} from '@/constants/ExcelEmulator/table';
import { useFireworksContext } from '@/contexts/FireworksContext';
import { useProgressContext } from '@/contexts/ProgressContext';
import { defaultStepsValues, ProgressSteps } from '@/contexts/ProgressSteps';
import { useSelectionContext } from '@/contexts/SelectionContext';
import { cn } from '@/lib';
import { TTableCellProps } from '@/types/ExcelEmulator/cellPropTypes';

import { getTableCellContent } from './helpers/getTableCellContent';
import { isCellInLookupTable } from './helpers/isCellInLookupTable';
import { isCellInMainTable } from './helpers/isCellInMainTable';
import { isCellInTargetTable } from './helpers/isCellInTargetTable';
import { isInnerTableCol } from './helpers/isInnerTableCol';
import { isInnerTableRow } from './helpers/isInnerTableRow';
import { TOptionalColSpec } from './TColSpec';
import { HintToolTip } from './ToolTip';

/** Amount of wrong selections before a tip */
const wrongSelectionsLimit = 2;

export function TableCell(props: TTableCellProps) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const { startFireworks } = useFireworksContext();
  const { children, onClick, className, id, rowIndex, colIndex, spanCount, style } = props;
  const { step, setNextStep } = useProgressContext();
  const showLookupCells =
    step > ProgressSteps.StepSelectLookupRange && isCellInLookupTable(rowIndex, colIndex);
  const {
    selecting: isSelecting,
    correct: selectionIsCorrect,
    wrongClicksCount,
    setWrongClicksCount,
  } = useSelectionContext();
  const isCellInSelection = useIsCellInSelection(rowIndex, colIndex);
  const {
    hintCellName,
    hintCellClassName,
    // Click
    clickCellName,
    clickCellClassName,
    clickWrongCellMessage,
    clickCorrectCellMessage,
    // Selection
    selectionStartCellName,
    selectionStartCellClassName,
    selectionFinishCellName,
    selectionFinishCellClassName,
  } = useStepData();
  const colName = getColName(colIndex);
  const cellName = getCellName(rowIndex, colIndex);
  const isMainTableCell = isCellInMainTable(rowIndex, colIndex);
  const isTargetTableCell = isCellInTargetTable(rowIndex, colIndex);
  const mainRowSpec: TOptionalColSpec = isMainTableCell ? mainRowSpecs[rowIndex] : undefined;
  const genericColSpec: TOptionalColSpec = genericColSpecs[colName];
  const mainColSpec: TOptionalColSpec = isMainTableCell ? mainColSpecs[colName] : undefined;
  const cellSpec: TOptionalColSpec = cellSpecs[cellName];
  const content = children || getTableCellContent(step, rowIndex, colIndex);
  const hasHint = cellName === hintCellName;
  // const isEquationFinished = step >= ProgressSteps.StepExtendRawResults;
  const isEquationExtended = step > ProgressSteps.StepExtendRawResults;
  const isStepAddSubstrColumn = step > ProgressSteps.StepAddSubstrColumn;
  const isEquationFinal = step > ProgressSteps.StepExtendFinalResults;
  const isSelectionFinish = isSelecting && cellName === selectionFinishCellName;
  const isSelectionStart = isSelecting && cellName === selectionStartCellName;
  const isExpectedClickCell = clickCellName && cellName === clickCellName;

  const handleClick = React.useCallback(
    (ev: React.MouseEvent<HTMLTableCellElement>) => {
      if (clickCellName) {
        const node = nodeRef.current;
        if (node) {
          // Add & remove accent
          node.dataset.clicked = isExpectedClickCell ? 'correct' : 'wrong';
          setTimeout(() => delete node.dataset.clicked, 1000);
        }
        if (!isExpectedClickCell) {
          const showTip = wrongClicksCount >= wrongSelectionsLimit;
          if (cellName !== inputCellName) {
            toast.error(
              clickWrongCellMessage || 'Выбрана неверная ячейка: ' + cellName + '.',
              defaultToastOptions,
            );
          }
          if (showTip) {
            toast.info(showTip && 'Выберите ячейку ' + clickCellName + '.', defaultToastOptions);
          }
          setWrongClicksCount((count) => count + 1);
          return;
        } else {
          toast.success(
            clickCorrectCellMessage || 'Выбрана ячейка: ' + cellName + '.',
            defaultToastOptions,
          );
        }
      }
      if (onClick) {
        onClick(ev);
      } else if (step === ProgressSteps.StepAddSubstrColumn) {
        const expectedValue = defaultStepsValues[step + 1];
        const inputCellField = document.getElementById(inputCellFieldId) as HTMLInputElement | null;
        if (expectedValue && inputCellField) {
          inputCellField.value = expectedValue;
          startFireworks({ x: ev.clientX, y: ev.clientY });
          setTimeout(setNextStep, successReactionDelay);
        }
      }
    },
    [
      cellName,
      clickCellName,
      clickCorrectCellMessage,
      clickWrongCellMessage,
      isExpectedClickCell,
      onClick,
      setNextStep,
      step,
      wrongClicksCount,
      setWrongClicksCount,
      startFireworks,
    ],
  );

  return (
    <div
      ref={nodeRef}
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
        showLookupCells && 'bg-green-500/10',
        isCellInSelection &&
          (selectionIsCorrect ? 'before:bg-green-500/30' : 'before:bg-blue-500/10'),
        isTargetTableCell && 'border border-solid border-gray-300',
        isMainTableCell && 'border border-solid border-black',
        isMainTableCell && 'whitespace-nowrap',
        isMainTableCell ? 'text-black' : 'text-gray-500',
        isInnerTableRow(rowIndex, colIndex) && 'border-t-0',
        isInnerTableCol(rowIndex, colIndex) && 'border-l-0',
        mainRowSpec?.className,
        genericColSpec?.className,
        mainColSpec?.className,
        cellSpec?.className,
        hasHint && hintCellClassName,
        isExpectedClickCell && clickCellClassName,
        isSelectionFinish && selectionFinishCellClassName,
        isSelectionStart && selectionStartCellClassName,
        isStepAddSubstrColumn && cellName === substrCellName && 'bg-blue-500/15',
        isEquationExtended && isTargetTableCell && 'border-white text-black',
        isEquationExtended &&
          isTargetTableCell &&
          (isEquationFinal ? 'bg-orange-500/20' : 'bg-blue-500/15'),
        isEquationExtended &&
          typeof content === 'string' &&
          content.startsWith('-') &&
          'text-red-500 font-bold',
        (clickCellName || selectionStartCellName) &&
          !!rowIndex &&
          !!colIndex &&
          'hover:before:inset-ring hover:before:inset-ring-blue-500',
        className,
      )}
      style={{
        ...style,
        gridColumn: spanCount && `span ${spanCount} / span ${colsCount}`,
      }}
      onClick={handleClick}
    >
      {content}
      {hasHint && <HintToolTip />}
    </div>
  );
}
