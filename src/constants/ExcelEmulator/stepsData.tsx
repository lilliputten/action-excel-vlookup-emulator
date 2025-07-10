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
  // Hint tooltip celll
  hintCellName?: TCellName;
  hintCellClassName?: string;
  hintContent?: TReactNode;
  hintClassName?: string;
  // Finish cell (for range selection)
  finishCellName?: TCellName;
  finishCellClassName?: string;
  finishContent?: TReactNode;
  finishClassName?: string;
}

export const equationBegin = '=ВПР(';
export const equationEnd = ';3;0)';

export const stepsData: Record<ProgressSteps, TStepsDataItem> = {
  [ProgressSteps.StepStart]: {
    text: 'Выберите ячейку для ввода',
    hintCellName: inputCellName,
    hintContent: 'Начните вводить формулу в эту ячейку',
    // hintClassName: 'w-[200%]',
    hintClassName: 'whitespace-nowrap',
    hintCellClassName: 'animated-background',
  },
  [ProgressSteps.StepEquationStart]: {
    text: 'Начните вводить формулу в ячейку',
    hintCellName: inputCellName,
    hintContent: (
      <>
        Введите начало формулы:{' '}
        <code className="rounded-md border border-white/20 bg-white/10 px-1">{equationBegin}</code>
      </>
    ),
    hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepSelectSourceColunn]: {
    text: 'Выберите исходную колонку',
    hintCellName: sourceCellName, // 'B6',
    hintContent: 'Кликните на этой ячейке, чтобы выбрать её в качестве исходной',
    hintClassName: 'text-wrap w-[140px]',
    hintCellClassName: 'animated-background',
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
    hintCellClassName: 'before:bg-blue-500/40',
    hintContent: 'Начните выделение диапазона просмотра с этой ячейки',
    hintClassName: 'whitespace-nowrap',
    finishCellName: lookupRangeLastCellName,
    finishCellClassName: 'before:bg-green-500/40',
    finishContent: 'Закончите выделение здесь',
    finishClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepEquationFinish]: {
    text: 'Закончите ввод формулы',
    hintCellName: inputCellName,
    hintClassName: 'w-[140%]',
    hintContent: (
      <>
        Добавьте номер столбца, нулевое значение интервального просмотра и закрывающую скобку:{' '}
        <code className="rounded-md border border-white/20 bg-white/10 px-1">{equationEnd}</code>
      </>
    ),
  },
  [ProgressSteps.StepExtendResults]: {
    text: 'Растяните ячейку с результатами',
    hintCellName: inputCellName,
    hintClassName: 'w-[140%]',
    hintContent: 'Растяиите эту ячейку вниз, чтобы увидеть все результаты (В РАБОТЕ)',
  },
  [ProgressSteps.StepDone]: {
    text: 'Все задачи выполнены!',
    textClassName: 'bg-green-500',
  },
};
