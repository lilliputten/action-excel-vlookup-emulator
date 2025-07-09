import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { isDev } from '@/config';
import { useProgressContext } from '@/contexts/ProgressContext';
import { cn } from '@/lib';

export function ProgressNav() {
  const { setNextStep, setPrevStep, isFirstStep, isLastStep } = useProgressContext();

  /* // DEBUG
   * React.useEffect(() => {
   *   console.log('[ProgressNav:ProgressContext]', {
   *     // step,
   *     isFirstStep,
   *     isLastStep,
   *     // stepIndex,
   *   });
   * }, [step, isFirstStep, isLastStep, stepIndex]);
   */

  const content = 'Шаг 1: Начните вводить формулу в ячейку';

  return (
    <div
      className={cn(
        isDev && '__ProgressNav', // DEBUG
        'fixed',
        'bottom-4',
        'w-full',
        // 'inset-x-0 mx-auto',
        'flex items-stretch justify-center gap-2',
      )}
    >
      {!isFirstStep && (
        <div
          className={cn(
            isDev && '__ProgressNav_PrevStep', // DEBUG
            'flex items-center justify-center',
            'bg-teal-500 text-white',
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
          'px-4 py-0',
          'truncate',
        )}
        title={content}
      >
        <div className="truncate">{content}</div>
      </div>
      {!isLastStep && (
        <div
          className={cn(
            isDev && '__ProgressNav_NextStep', // DEBUG
            'flex items-center justify-center',
            'bg-teal-500 text-white',
            'rounded-full shadow-lg/30',
            'transition',
            'cursor-pointer',
            'hover:opacity-80',
            'p-2',
            isLastStep && 'disabled pointer-events-none bg-gray-400 opacity-50',
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
