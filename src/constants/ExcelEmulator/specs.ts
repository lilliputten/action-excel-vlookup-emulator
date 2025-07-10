import { TColSpec } from '@/components/ExcelEmulator/TColSpec';
import { TCellName, TColName } from '@/types/ExcelEmulator';

import { mainTableColsCount } from './table';

export const genericColSpecs: Record<TColName, TColSpec> = {
  I: { className: 'min-w-[50px]' },
  J: { className: 'min-w-[160px]' },
  K: { className: 'min-w-[50px]' },
  L: { className: 'min-w-[50px]' },
};

export const mainColSpecs: Record<TColName, TColSpec> = {
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

export const cellSpecs: Record<TCellName, TColSpec> = {
  A2: {
    colSpan: mainTableColsCount,
    className: 'text-black text-xl text-center font-bold',
    content: 'Акт сверки',
  },
  A3: { colSpan: 4, content: 'По данным ООО "Весна", руб.' },
  E3: { colSpan: 4, content: 'По данным ООО "Ирис", руб.' },
  A5: { colSpan: 2, content: 'Сальдо начальное' },
  E5: { colSpan: 2, content: 'Сальдо начальное' },
  A17: { colSpan: 2, content: 'Обороты за период' },
  E17: { colSpan: 2, content: 'Обороты за период' },
  A18: { colSpan: 2, content: 'Сальдо конечное' },
  E18: { colSpan: 2, content: 'Сальдо конечное' },
  A20: { colSpan: mainTableColsCount, content: 'По данным ООО "Весна"' },
  A21: {
    colSpan: mainTableColsCount,
    className: 'font-bold',
    content: 'на 31.07.2025 задолженность в пользу ООО "Весна" 11 677,00 руб.',
  },
  A22: {
    colSpan: mainTableColsCount,
    className: 'font-bold',
    content: '(Одиннадцать тысяч шестьсот семьдесят семь рублей 00 копеек)',
  },
  /* // UNUSED: It's styled in `TableInputCell`
   * [inputCellName]: {
   *   className: 'border-3 border-solid border-blue-500',
   * },
   */
};
