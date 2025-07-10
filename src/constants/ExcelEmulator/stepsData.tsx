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
  // State
  onEnterMessage?: string;
  // Click
  clickCellName?: TCellName;
  clickCellClassName?: string;
  clickWrongCellMessage?: string;
  clickCorrectCellMessage?: string;
  // Selection
  selectionStartCellName?: TCellName;
  selectionStartCellClassName?: string;
  selectionFinishCellName?: TCellName;
  selectionFinishCellClassName?: string;
  // Hint tooltip celll
  hintCellName?: TCellName;
  hintCellClassName?: string;
  hintContent?: TReactNode;
  hintClassName?: string;
}

export const equationBegin = '=ВПР(';
export const equationEnd = ';3;0)';

export const stepsData: Record<ProgressSteps, TStepsDataItem> = {
  [ProgressSteps.StepStart]: {
    text: 'Выберите ячейку для ввода формулы',
    onEnterMessage: 'Выберите ячейку, в которую будете вводить формулу.',
    hintCellName: inputCellName,
    hintContent: 'Начните вводить формулу в эту ячейку',
    hintClassName: 'whitespace-nowrap',
    hintCellClassName: 'animated-background',
  },
  [ProgressSteps.StepEquationStart]: {
    text: 'Начните вводить формулу в ячейку',
    onEnterMessage: 'Введите начало формулы.',
    hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepSelectSourceColumn]: {
    text: 'Выберите исходный столбец',
    onEnterMessage: 'Кликните по ячейке с данными для сравнения или введите её адрес в формулу.',
    clickCellName: sourceCellName, // 'B6',
    clickWrongCellMessage: 'Выбрана неверная исходная ячейка',
    clickCorrectCellMessage: 'Выбрана исходная ячейка',
  },
  [ProgressSteps.StepEquationSemicolon]: {
    text: 'Продолжите редактирование формулы',
    onEnterMessage: 'Добавьте разделитель в формулу.',
  },
  [ProgressSteps.StepSelectLookupRange]: {
    text: 'Выделите или введите диапазон для поиска',
    onEnterMessage:
      'Выберите мышью диапазон для поиска или введите адреса начальной и конечной ячеек диапазона в формулу.',
    selectionStartCellName: lookupRangeFirstCellName,
    selectionFinishCellName: lookupRangeLastCellName,
  },
  [ProgressSteps.StepEditLookupRange]: {
    text: 'Отредактируйте диапазон поиска в формуле',
    onEnterMessage: 'Отредактируйте адреса ячеек диапазона поиска.',
  },
  [ProgressSteps.StepAddColumnNumber]: {
    text: 'Добавьте номер столбца',
    onEnterMessage: 'Добавьте номер столбца в формулу (через разделитель).',
  },
  [ProgressSteps.StepAddInterval]: {
    text: 'Добавьте значение интервального просмотра',
    onEnterMessage: 'Добавьте значение интервального просмотра в формулу (через разделитель).',
  },
  [ProgressSteps.StepFinishEquation]: {
    text: 'Закончите редактирование формулы',
    onEnterMessage: 'Закройте скобку после последнего значения формулы и нажмите Enter.',
  },
  [ProgressSteps.StepExtendResults]: {
    text: 'Растяните ячейку с результатами',
    hintCellName: inputCellName,
    hintClassName: 'w-[140%]',
    hintContent: 'Растяните эту ячейку вниз, чтобы увидеть все результаты (В РАБОТЕ)',
  },
  [ProgressSteps.StepDone]: {
    text: 'Все задачи выполнены!',
    textClassName: 'bg-green-500',
  },
};
