import {
  auxTableFirstCol,
  auxTableLastCol,
  mainTableFirstRow,
  mainTableLastRow,
} from '../constants/table';

export function checkIfAuxTableCell(rowIndex: number, colIndex: number) {
  const isMainTableCell =
    colIndex >= auxTableFirstCol &&
    colIndex <= auxTableLastCol &&
    rowIndex >= mainTableFirstRow &&
    rowIndex <= mainTableLastRow;
  return isMainTableCell;
}
