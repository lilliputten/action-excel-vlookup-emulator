import {
  auxTableFirstCol,
  auxTableFirstRow,
  auxTableLastCol,
  auxTableLastRow,
} from '../constants/table';

export function checkIfAuxTableCell(rowIndex: number, colIndex: number) {
  const isMainTableCell =
    colIndex >= auxTableFirstCol &&
    colIndex <= auxTableLastCol &&
    rowIndex >= auxTableFirstRow &&
    rowIndex <= auxTableLastRow;
  return isMainTableCell;
}
