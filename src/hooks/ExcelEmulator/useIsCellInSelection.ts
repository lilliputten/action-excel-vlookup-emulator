import { useSelectionContext } from '@/contexts/SelectionContext';

export function useIsCellInSelection(rowIndex: number, colIndex: number) {
  const { selecting, selectionStart, selectionFinish } = useSelectionContext();
  if (!selecting || !selectionStart || !selectionFinish) {
    return false;
  }
  const startRowIndex = Number(selectionStart.dataset.rowIndex);
  const startColIndex = Number(selectionStart.dataset.colIndex);
  const finishRowIndex = Number(selectionFinish.dataset.rowIndex);
  const finishColIndex = Number(selectionFinish.dataset.colIndex);
  const isCellInSelection =
    colIndex >= startColIndex &&
    colIndex <= finishColIndex &&
    rowIndex >= startRowIndex &&
    rowIndex <= finishRowIndex;
  return isCellInSelection;
}
