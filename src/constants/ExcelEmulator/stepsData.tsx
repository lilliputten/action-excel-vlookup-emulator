import {
  inputCellName,
  lookupRangeFirstCellName,
  lookupRangeLastCellName,
  sourceCellName,
  substrCellName,
  targetRangeFirstCellName,
  targetRangeLastCellName,
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
  selectionSuccessMessage?: string;
  selectionErrorMessage?: string;
  // Hint tooltip cell
  hintCellName?: TCellName;
  hintCellClassName?: string;
  hintContent?: TReactNode;
  hintClassName?: string;
}

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
    // clickWrongCellMessage: 'Выбрана неверная исходная ячейка.',
    clickCorrectCellMessage: 'Выбрана исходная ячейка: ' + sourceCellName + '.',
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
    text: 'Закрепите диапазон поиска в формуле',
    onEnterMessage:
      'Закрепите адреса ячеек диапазона поиска (вручную или нажав F4, находясь в поле ввода).',
  },
  [ProgressSteps.StepAddColumnNumber]: {
    text: 'Добавьте номер столбца',
    onEnterMessage: 'Добавьте (через разделитель) номер столбца в формулу.',
  },
  [ProgressSteps.StepAddInterval]: {
    text: 'Добавьте значение интервального просмотра',
    onEnterMessage: 'Добавьте (через разделитель) значение интервального просмотра в формулу.',
  },
  [ProgressSteps.StepFinishEquation]: {
    text: 'Закончите редактирование формулы',
    onEnterMessage: 'Закройте скобку после последнего значения формулы и нажмите Enter.',
  },
  [ProgressSteps.StepExtendRawResults]: {
    text: 'Растяните ячейку с результатами',
    onEnterMessage: 'Растяните ячейку с результатом вниз, чтобы увидеть все данные',
    selectionStartCellName: targetRangeFirstCellName,
    selectionFinishCellName: targetRangeLastCellName,
    selectionSuccessMessage: 'Ячейка с результатами растянута.',
    selectionErrorMessage: 'Нужно растянуть ячейку на высоту всех строк с данными.',
  },
  [ProgressSteps.StepSelectEquatonAgain]: {
    text: 'Ещё раз отредактируйте ячейку с формулой',
    onEnterMessage: 'Кликните по ячейке с формулой, чтобы добавить вычитание столбцов.',
    hintCellName: inputCellName,
    hintContent: 'Кликните по ячейке ещё раз',
    hintClassName: 'whitespace-nowrap',
  },
  [ProgressSteps.StepAddSubstrColumn]: {
    clickCellName: substrCellName, // 'D6',
    // clickWrongCellMessage: 'Выбрана неверная ячейка для вычитания.',
    clickCorrectCellMessage: 'Выбрана ячейка для вычитания: ' + substrCellName + '.',
    text: 'Дополните формулу адресом столбца для вычитания',
    onEnterMessage:
      'Выберите столбец, данные которого надо вычесть из предыдущих результатов. Или добавьте адрес столбца в формулу вручную, после этого нажмите Enter.',
  },
  [ProgressSteps.StepExtendFinalResults]: {
    text: 'Растяните ячейку с результатами ещё раз',
    onEnterMessage: 'Растяните ячейку с результатом вниз ещё раз, чтобы обновить все данные.',
    selectionStartCellName: targetRangeFirstCellName,
    selectionFinishCellName: targetRangeLastCellName,
    selectionSuccessMessage: 'Ячейка с результатами растянута.',
    selectionErrorMessage: 'Нужно растянуть ячейку на высоту всех строк с данными.',
  },
  [ProgressSteps.StepDone]: {
    text: 'Все задачи выполнены!',
    textClassName: 'bg-green-500',
  },
};
