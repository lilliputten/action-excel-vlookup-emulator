import { useSelectionContext } from '@/contexts/SelectionContext';

export function useIsCellInSelection(rowIndex: number, colIndex: number) {
  const { selecting, selectionStart, selectionFinish } = useSelectionContext();
  if (!selecting || !selectionStart || !selectionFinish) {
    return false;
  }
  let startRowIndex = Number(selectionStart.dataset.rowIndex);
  let startColIndex = Number(selectionStart.dataset.colIndex);
  let finishRowIndex = Number(selectionFinish.dataset.rowIndex);
  let finishColIndex = Number(selectionFinish.dataset.colIndex);
  if (startRowIndex > finishRowIndex) {
    const x = startRowIndex;
    startRowIndex = finishRowIndex;
    finishRowIndex = x;
  }
  if (startColIndex > finishColIndex) {
    const x = startColIndex;
    startColIndex = finishColIndex;
    finishColIndex = x;
  }
  const isCellInSelection =
    colIndex >= startColIndex &&
    colIndex <= finishColIndex &&
    rowIndex >= startRowIndex &&
    rowIndex <= finishRowIndex;
  return isCellInSelection;
}
