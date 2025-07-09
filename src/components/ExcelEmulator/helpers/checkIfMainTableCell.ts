import {
  mainTableFirstCol,
  mainTableFirstRow,
  mainTableLastCol,
  mainTableLastRow,
} from '../constants/table';

export function checkIfMainTableCell(rowIndex: number, colIndex: number) {
  const isMainTableCell =
    colIndex >= mainTableFirstCol &&
    colIndex <= mainTableLastCol &&
    rowIndex >= mainTableFirstRow &&
    rowIndex <= mainTableLastRow;
  return isMainTableCell;
}
