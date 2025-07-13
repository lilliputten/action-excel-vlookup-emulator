import React from 'react';
import { ChevronLeft, ChevronRight, Info, Maximize, Minimize, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import screenfull from 'screenfull';

import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { defaultToastOptions, isDev } from '@/config';
import { helpMessageDelay } from '@/constants/ExcelEmulator';
import { useProgressContext } from '@/contexts/ProgressContext';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { cn } from '@/lib';

interface TProgressNavProps {
  canGoForward: boolean;
  onGoForward: () => void;
  helpMessage?: string;
}

export function ProgressNav(props: TProgressNavProps) {
  const { canGoForward, onGoForward, helpMessage } = props;
  const { step, setPrevStep, setFirstStep, isFirstStep, isLastStep, allowedNextStep } =
    useProgressContext();
  const [showHelp, setShowHelp] = React.useState(false);

  const [isFullscreen, setFullscreen] = React.useState(false);

  React.useEffect(() => {
    setShowHelp(true);
    setTimeout(() => setShowHelp(false), helpMessageDelay);
  }, [step]);

  const { text, textClassName } = useStepData();

  const handleShowHelp = () => {
    toast.info(helpMessage, { ...defaultToastOptions, autoClose: helpMessageDelay });
    setShowHelp(true);
    setTimeout(() => setShowHelp(false), helpMessageDelay);
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
        <NavIcon
          className={cn(
            isDev && '__ProgressNav_PrevStep', // DEBUG
            'bg-blue-500',
          )}
          disabled={isFirstStep}
          title="Предыдущий шаг"
          onClick={setPrevStep}
        >
          <ChevronLeft size="2em" />
        </NavIcon>
      )}
      {!isFirstStep && (
        <NavIcon
          className={cn(
            isDev && '__ProgressNav_Replay', // DEBUG
            'bg-blue-500',
          )}
          title="Начать сначала"
          onClick={setFirstStep}
          disabled={isFirstStep}
        >
          <RotateCcw size="2em" />
        </NavIcon>
      )}
      <NavStatus
        className={cn(
          isDev && '__ProgressNav_Status', // DEBUG
          textClassName,
        )}
        text={text}
        step={step}
      />
      <NavIcon
        className={cn(
          isDev && '__ProgressNav_Fullscreen', // DEBUG
          'bg-blue-500',
        )}
        title="Полноэкранный режим"
        onClick={toggleFullscreen}
      >
        <FullScreenIcon size="2em" />
      </NavIcon>
      <NavIcon
        className={cn(
          isDev && '__ProgressNav_Help', // DEBUG
          'bg-teal-500',
        )}
        disabled={!helpMessage || showHelp}
        title="Текст подсказки для данного шага"
        onClick={handleShowHelp}
      >
        <Info size="2em" />
      </NavIcon>
      {!isLastStep && (
        <NavIcon
          className={cn(
            isDev && '__ProgressNav_NextStep', // DEBUG
            'bg-blue-500',
          )}
          disabled={!canGoForward && !allowedNextStep}
          title="Следующий шаг"
          onClick={onGoForward}
        >
          <ChevronRight size="2em" />
        </NavIcon>
      )}
    </div>
  );
}

interface TIconProps {
  onClick: () => void;
  title: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  // Icon: React.ForwardRefExoticComponent<LucideProps>;
}

function NavIcon(props: TIconProps) {
  const { onClick, title, className, children, disabled } = props;
  return (
    <div
      className={cn(
        isDev && '__ProgressNav_NavIcon', // DEBUG
        'flex items-center justify-center',
        'text-white',
        'rounded-full shadow-lg/30',
        'transition',
        'cursor-pointer',
        'hover:opacity-80',
        'p-2',
        disabled && 'disabled pointer-events-none opacity-25',
        className,
      )}
      title={title}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface TNavStatusProps {
  text: string;
  className?: string;
  step: ProgressSteps;
}
function NavStatus(props: TNavStatusProps) {
  const { text, className, step } = props;
  return (
    <div
      className={cn(
        isDev && '__ProgressNav_Status', // DEBUG
        'flex items-center justify-center',
        'bg-slate-500 text-white',
        'rounded-3xl shadow-lg/30',
        'px-6 py-0',
        'truncate',
        className,
      )}
      title={text}
    >
      <div className="truncate">
        <span className="pr-1 font-bold opacity-50">Шаг {step + 1}:</span> {text}
      </div>
    </div>
  );
}
