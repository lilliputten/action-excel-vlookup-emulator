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
  // Input
  // checkInput?: boolean | string;
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
  // Finish cell (for range selection)
  // finishCellName?: TCellName;
  // finishCellClassName?: string;
  // finishContent?: TReactNode;
  // finishClassName?: string;
}

export const equationBegin = '=ВПР(';
export const equationEnd = ';3;0)';

export const stepsData: Record<ProgressSteps, TStepsDataItem> = {
  [ProgressSteps.StepStart]: {
    text: 'Выберите ячейку для ввода формулы',
    onEnterMessage: 'Выберите ячейку, в которую будете вводить формулу.',
    hintCellName: inputCellName,
    hintContent: 'Начните вводить формулу в эту ячейку',
    // hintClassName: 'w-[200%]',
    hintClassName: 'whitespace-nowrap',
    hintCellClassName: 'animated-background',
  },
  [ProgressSteps.StepEquationStart]: {
    text: 'Начните вводить формулу в ячейку',
    onEnterMessage: 'Введите начало формулы.',
    // hintCellName: inputCellName,
    // hintContent: 'Введите начало формулы',
    // hintContent: (
    //   <>
    //     Введите начало формулы:{' '}
    //     <code className="rounded-md border border-white/20 bg-white/10 px-1">{equationBegin}</code>
    //   </>
    // ),
    hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepSelectSourceColumn]: {
    text: 'Выберите исходную колонку',
    onEnterMessage: 'Кликните по ячейке с данными для сравнения или введите её адрес в формулу.',
    clickCellName: sourceCellName, // 'B6',
    clickWrongCellMessage: 'Выбрана неверная исходная ячейка',
    clickCorrectCellMessage: 'Выбрана исходная ячейка',
    // hintContent: 'Кликните на этой ячейке, чтобы выбрать её в качестве исходной',
    // hintClassName: 'text-wrap w-[140px]',
    // hintCellClassName: 'animated-background',
  },
  [ProgressSteps.StepEquationSemicolon]: {
    text: 'Продолжите редактирование формулы',
    onEnterMessage: 'Добавьте разделитель в формулу.',
    // hintCellName: inputCellName,
    // hintContent: 'Добавьте точку с запятой',
    // hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepSelectLookupRange]: {
    text: 'Выделите или введите диапазон для поиска',
    onEnterMessage:
      'Выберите мышью диапазон для поиска или введите адреса начальной и конечной ячеек диапазона в формулу.',
    selectionStartCellName: lookupRangeFirstCellName,
    // selectionStartCellClassName: 'before:bg-blue-500/40',
    // hintCellName: lookupRangeFirstCellName,
    // hintCellClassName: 'before:bg-blue-500/40',
    // hintContent: 'Начните выделение диапазона просмотра с этой ячейки',
    // hintClassName: 'whitespace-nowrap',
    selectionFinishCellName: lookupRangeLastCellName,
    // selectionFinishCellClassName: 'before:bg-green-500/40',
    // finishCellName: lookupRangeLastCellName,
    // finishCellClassName: 'before:bg-green-500/40',
    // finishContent: 'Закончите выделение здесь',
    // finishClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepAddColumnNumber]: {
    text: 'Добавьте номер столбца',
    onEnterMessage: 'Добавьте номер столбца в формулу.',
  },
  [ProgressSteps.StepAddInterval]: {
    text: 'Добавьте значение интервального просмотра',
    onEnterMessage: 'Добавьте значение интервального просмотра в формулу.',
  },
  [ProgressSteps.StepFinishEquation]: {
    text: 'Закончите редактирование формулы',
    onEnterMessage: 'Добавьте скобку и нажмите Enter.',
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
