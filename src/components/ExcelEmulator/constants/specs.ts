import { TColSpec } from '../TColSpec';
import { inputCellKey, mainTableColsCount } from './table';

export const genericColSpecs: Record<string, TColSpec> = {
  I: { className: 'min-w-[50px]' },
  J: { className: 'min-w-[100px]' },
  K: { className: 'min-w-[50px]' },
  L: { className: 'min-w-[50px]' },
};

export const mainColSpecs: Record<string, TColSpec> = {
  C: { className: 'text-right' },
  D: { className: 'text-right' },
  G: { className: 'text-right' },
  H: { className: 'text-right' },
};

export const mainRowSpecs: Record<number, TColSpec> = {
  // Specify defaults for rows' cells
  5: { className: 'font-bold' },
  17: { className: 'font-bold' },
  18: { className: 'font-bold' },
};

export const cellSpecs: Record<string, TColSpec> = {
  '2_A': {
    colSpan: mainTableColsCount,
    className: 'text-black text-xl text-center font-bold',
    content: 'Акт сверки',
  },
  '3_A': { colSpan: 4, content: 'По данным ООО "Весна", руб.' },
  '3_E': { colSpan: 4, content: 'По данным ООО"Ирис", руб.' },
  '5_A': { colSpan: 2, content: 'Сальдо начальное' },
  '5_E': { colSpan: 2, content: 'Сальдо начальное' },
  '17_A': { colSpan: 2, content: 'Обороты за период' },
  '17_E': { colSpan: 2, content: 'Обороты за период' },
  '18_A': { colSpan: 2, content: 'Сальдо конечное' },
  '18_E': { colSpan: 2, content: 'Сальдо конечное' },
  '20_A': { colSpan: mainTableColsCount, content: 'По данным ООО "В"' },
  '21_A': {
    colSpan: mainTableColsCount,
    className: 'font-bold',
    content: 'на 30.09.2021 задолженность в пользу ООО "Весна" 11 677,00 руб.',
  },
  '22_A': {
    colSpan: mainTableColsCount,
    className: 'font-bold',
    content: '(Одиннадцать тысяч шестьсот семьдесят семь рублей 00 копеек)',
  },
  [inputCellKey]: {
    className: 'border-3 border-solid border-blue-500',
    // content: 'X',
  },
};
