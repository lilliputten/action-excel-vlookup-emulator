import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import { useProgressContext } from '@/contexts/ProgressContext';
import { cn } from '@/lib';

export function ProgressNav() {
  const { stepIndex, setNextStep, setPrevStep, isFirstStep, isLastStep, allowedNextStep } =
    useProgressContext();

  const { text, textClassName } = useStepData();

  return (
    <div
      className={cn(
        isDev && '__ProgressNav', // DEBUG
        'fixed',
        'select-none',
        'bottom-4',
        'w-full',
        'h-[3em]',
        'flex items-stretch justify-center gap-2',
      )}
    >
      {!isFirstStep && (
        <div
          className={cn(
            isDev && '__ProgressNav_PrevStep', // DEBUG
            'flex items-center justify-center',
            'bg-violet-500 text-white',
            'rounded-full shadow-lg/30',
            'transition',
            'cursor-pointer',
            'hover:opacity-80',
            'p-2',
            isFirstStep && 'disabled pointer-events-none bg-gray-400 opacity-50',
          )}
          title="Предыдущий шаг"
          onClick={setPrevStep}
        >
          <ChevronLeft size="2em" />
        </div>
      )}
      <div
        className={cn(
          isDev && '__ProgressNav_Status', // DEBUG
          'flex items-center justify-center',
          'bg-blue-500 text-white',
          'rounded-3xl shadow-lg/30',
          'px-6 py-0',
          'truncate',
          textClassName,
        )}
        title={text}
      >
        <div className="truncate">
          <span className="pr-1 font-bold opacity-50">Шаг {stepIndex + 1}:</span> {text}
        </div>
      </div>
      {!isLastStep && (
        <div
          className={cn(
            isDev && '__ProgressNav_NextStep', // DEBUG
            'flex items-center justify-center',
            'bg-violet-500 text-white',
            'rounded-full shadow-lg/30',
            'transition',
            'cursor-pointer',
            'hover:opacity-80',
            'p-2',
            !allowedNextStep && 'disabled pointer-events-none bg-gray-400 opacity-50',
          )}
          title="Следующий шаг"
          onClick={setNextStep}
        >
          <ChevronRight size="2em" />
        </div>
      )}
    </div>
  );
}
