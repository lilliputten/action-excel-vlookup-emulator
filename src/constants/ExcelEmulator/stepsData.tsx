import { inputCellKey, sourceCellKey } from '@/constants/ExcelEmulator/table';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { TReactNode } from '@/types/react';

// type THitCellAction = 'click' | undefined;

interface TStepsDataItem {
  text: string;
  textClassName?: string;
  hintCellKey?: string;
  // hintCellAction?: THitCellAction;
  hintCelClassName?: string;
  hintContent?: TReactNode;
  hintClassName?: string;
}

export const stepsData: Record<ProgressSteps, TStepsDataItem> = {
  [ProgressSteps.StepStart]: {
    text: 'Выберите ячейку для ввода',
    hintCellKey: inputCellKey,
    hintContent: 'Выберите эту ячейку',
    // hintClassName: 'w-[200%]',
    hintClassName: 'whitespace-nowrap',
    hintCelClassName: 'animated-background',
  },
  [ProgressSteps.StepEquationStart]: {
    text: 'Начните вводить формулу в ячейку',
    hintCellKey: inputCellKey,
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
    hintCellKey: sourceCellKey, // '6_B',
    // hintCellAction: 'click',
    hintContent: 'Кликните на этой ячейке',
    hintClassName: 'whitespace-nowrap',
    hintCelClassName: 'animated-background',
  },
  [ProgressSteps.StepDone]: {
    text: 'Все задачи выполнены!',
    textClassName: 'bg-green-500',
  },
};
