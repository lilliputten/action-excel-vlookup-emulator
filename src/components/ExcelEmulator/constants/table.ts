import { getColName } from '../utils/getColName';

export const colsCount = 13;
export const rowsCount = 25;

export const idDelim = '_';

export const mainTableFirstRow = 3;
export const mainTableLastRow = 18;

export const mainTableFirstCol = 1;
export const mainTableLastCol = 8;
export const mainTableColsCount = mainTableLastCol - mainTableFirstCol + 1;

export const auxTableFirstRow = mainTableFirstRow + 2;
export const auxTableLastRow = mainTableLastRow;

export const auxTableFirstCol = 10;
export const auxTableLastCol = 10;
export const auxTableColsCount = auxTableLastCol - auxTableFirstCol + 1;

// Column number 10, row 3
export const inputCellKey = `${auxTableFirstRow}_${getColName(auxTableFirstCol)}`;

export const rulerCellClassNames =
  'bg-gray-500 px-2 text-center border border-solid border-white text-white cursor-default';
