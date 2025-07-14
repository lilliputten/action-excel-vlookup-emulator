import i18next from 'i18next';

import { TLng } from '@/config/lang';
import { TColSpec } from '@/components/ExcelEmulator/TColSpec';
import { TCellName, TColName } from '@/types/ExcelEmulator';

import { mainTableColsCount } from './table';

const { t } = i18next;

export const genericColSpecs: Record<TColName, TColSpec> = {
  I: { className: 'min-w-[20px]' },
  J: { className: 'min-w-[240px]' }, // Input cell
  K: { className: 'min-w-[20px]' },
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

export function getCellSpecs(lng: TLng) {
  const cellSpecs: Record<TCellName, TColSpec> = {
    A2: {
      colSpan: mainTableColsCount,
      className: 'text-black text-xl text-center font-bold',
      content: t('reconciliation-report', { lng }),
    },
    A3: { colSpan: 4, content: t('po-dannym-ooo-vesna-rub', { lng }) },
    E3: { colSpan: 4, content: t('po-dannym-ooo-iris-rub', { lng }) },
    A5: { colSpan: 2, content: t('saldo-nachalnoe', { lng }) },
    E5: { colSpan: 2, content: t('saldo-nachalnoe', { lng }) },
    A17: { colSpan: 2, content: t('oboroty-za-period', { lng }) },
    E17: { colSpan: 2, content: t('oboroty-za-period', { lng }) },
    A18: { colSpan: 2, content: t('saldo-konechnoe', { lng }) },
    E18: { colSpan: 2, content: t('saldo-konechnoe', { lng }) },
    A20: { colSpan: mainTableColsCount, content: t('po-dannym-ooo-vesna', { lng }) },
    A21: {
      colSpan: mainTableColsCount,
      className: 'font-bold',
      content: t('zadolzhennost-v-polzu-ooo-vesna', { lng }),
    },
    A22: {
      colSpan: mainTableColsCount,
      className: 'font-bold',
      content: t('odinnadcat-tysyach-shestsot-semdesyat-sem-rublei-00-kopeek', { lng }),
    },
  };
  return cellSpecs;
}
export function useCellSpecs(lng: TLng) {
  return getCellSpecs(lng);
}
