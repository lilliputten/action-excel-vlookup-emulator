import {
  inputCellName,
  lookupRangeFirstCellName,
  lookupRangeLastCellName,
  sourceCellName,
} from '@/constants/ExcelEmulator/table';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { TCellName } from '@/types/ExcelEmulator';
import { TReactNode } from '@/types/react';

interface TStepsDataItem {
  text: string;
  textClassName?: string;
  hintCellName?: TCellName;
  hintCelClassName?: string;
  hintContent?: TReactNode;
  hintClassName?: string;
}

export const stepsData: Record<ProgressSteps, TStepsDataItem> = {
  [ProgressSteps.StepStart]: {
    text: 'Выберите ячейку для ввода',
    hintCellName: inputCellName,
    hintContent: 'Выберите эту ячейку',
    // hintClassName: 'w-[200%]',
    hintClassName: 'whitespace-nowrap',
    hintCelClassName: 'animated-background',
  },
  [ProgressSteps.StepEquationStart]: {
    text: 'Начните вводить формулу в ячейку',
    hintCellName: inputCellName,
    hintContent: (
      <>
        Введите начало формулы:{' '}
        <code className="rounded-md border border-white/20 bg-white/10 px-1">=ВПР(</code>
      </>
    ),
    hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepSelectSourceColunn]: {
    text: 'Выберите исходную колонку',
    hintCellName: sourceCellName, // 'B6',
    hintContent: 'Кликните на этой ячейке',
    hintClassName: 'whitespace-nowrap',
    hintCelClassName: 'animated-background',
  },
  [ProgressSteps.StepEquationSemicolon]: {
    text: 'Продолжите редактирование формулы',
    hintCellName: inputCellName,
    hintContent: 'Добавьте точку с запятой',
    hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepSelectLookupRangeStart]: {
    text: 'Выделите диапазон для поиска',
    hintCellName: lookupRangeFirstCellName,
    hintContent: 'Начните выделение с этой ячейки',
    hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepSelectLookupRangeFinish]: {
    text: 'Завершите выделение диапазона для поиска',
    hintCellName: lookupRangeLastCellName,
    hintContent: 'Закончите выделение здесь',
    hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepDone]: {
    text: 'Все задачи выполнены!',
    textClassName: 'bg-green-500',
  },
};
