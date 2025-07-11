import React from 'react';
import { ChevronLeft, ChevronRight, Info, Maximize, Minimize } from 'lucide-react';
import { toast } from 'react-toastify';
import screenfull from 'screenfull';

import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { defaultToastOptions, isDev, toastAutoCloseTimeout } from '@/config';
import { useProgressContext } from '@/contexts/ProgressContext';
import { cn } from '@/lib';

interface TProgressNavProps {
  canGoForward: boolean;
  onGoForward: () => void;
  helpMessage?: string;
}

const helpDelay = toastAutoCloseTimeout + 2000;

export function ProgressNav(props: TProgressNavProps) {
  const { canGoForward, onGoForward, helpMessage } = props;
  const { step, setPrevStep, isFirstStep, isLastStep, allowedNextStep } = useProgressContext();
  const [showHelp, setShowHelp] = React.useState(false);

  const [isFullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    setShowHelp(true);
    setTimeout(() => setShowHelp(false), helpDelay);
  }, [step]);

  const { text, textClassName } = useStepData();

  const handleShowHelp = () => {
    toast.info(helpMessage, defaultToastOptions);
    setShowHelp(true);
    setTimeout(() => setShowHelp(false), helpDelay);
  };

  React.useEffect(() => {
    if (isFullscreen) {
      screenfull.request();
    } else {
      screenfull.exit();
    }
  }, [isFullscreen]);

  const toggleFullscreen = () => setFullscreen((isFullscreen) => !isFullscreen);

  const FullScreenIcon = isFullscreen ? Minimize : Maximize;

  return (
    <div
      className={cn(
        isDev && '__ProgressNav', // DEBUG
        'fixed',
        'select-none',
        'bottom-4 left-4 right-4',
        'h-[3em]',
        'flex items-stretch justify-center gap-2',
      )}
    >
      {!isFirstStep && (
        <div
          className={cn(
            isDev && '__ProgressNav_PrevStep', // DEBUG
            'flex items-center justify-center',
            'bg-blue-500 text-white',
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
          'bg-slate-500 text-white',
          'rounded-3xl shadow-lg/30',
          'px-6 py-0',
          'truncate',
          textClassName,
        )}
        title={text}
      >
        <div className="truncate">
          <span className="pr-1 font-bold opacity-50">Шаг {step + 1}:</span> {text}
        </div>
      </div>
      <div
        className={cn(
          isDev && '__ProgressNav_Fullscreen', // DEBUG
          'flex items-center justify-center',
          'bg-blue-500 text-white',
          'rounded-full shadow-lg/30',
          'transition',
          'cursor-pointer',
          'hover:opacity-80',
          'p-2',
        )}
        title="Полноэкранный режим"
        onClick={toggleFullscreen}
      >
        <FullScreenIcon size="2em" />
      </div>
      <div
        className={cn(
          isDev && '__ProgressNav_Help', // DEBUG
          'flex items-center justify-center',
          'bg-teal-500 text-white',
          'rounded-full shadow-lg/30',
          'transition',
          'cursor-pointer',
          'hover:opacity-80',
          'p-2',
          (!helpMessage || showHelp) && 'disabled pointer-events-none bg-gray-400 opacity-50',
        )}
        title="Текст подсказки для данного шага"
        onClick={handleShowHelp}
      >
        <Info size="2em" />
      </div>
      {!isLastStep && (
        <div
          className={cn(
            isDev && '__ProgressNav_NextStep', // DEBUG
            'flex items-center justify-center',
            'bg-blue-500 text-white',
            'rounded-full shadow-lg/30',
            'transition',
            'cursor-pointer',
            'hover:opacity-80',
            'p-2',
            !canGoForward &&
              !allowedNextStep &&
              'disabled pointer-events-none bg-gray-400 opacity-50',
          )}
          title="Следующий шаг"
          onClick={onGoForward}
        >
          <ChevronRight size="2em" />
        </div>
      )}
    </div>
  );
}
