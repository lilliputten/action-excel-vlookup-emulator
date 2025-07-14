import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Maximize,
  Minimize,
  RotateCcw,
  // Languages,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import screenfull from 'screenfull';

import { allowedLanguageSwitch, languageNames, TLang, usedLanguages } from '@/config/lang';
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

interface TMemo {
  preventClose?: boolean;
}

export function ProgressNav(props: TProgressNavProps) {
  const { canGoForward, onGoForward, helpMessage } = props;
  const memo = React.useMemo<TMemo>(() => ({}), []);
  const { step, setPrevStep, setFirstStep, isFirstStep, isLastStep, allowedNextStep } =
    useProgressContext();
  const [showHelp, setShowHelp] = React.useState(false);

  const [isLangMenuOpen, toggleLangMenu] = React.useState(false);
  const closeLangMenu = React.useCallback(() => toggleLangMenu(false), []);

  const [isFullscreen, setFullscreen] = React.useState(false);

  const { i18n } = useTranslation();
  const { language } = i18n;

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

  const switchLanguage = React.useCallback(
    (lang: TLang) => {
      closeLangMenu();
      i18n.changeLanguage(lang);
    },
    [i18n, closeLangMenu],
  );

  React.useEffect(() => {
    if (isLangMenuOpen) {
      const closeMenu = () => {
        if (!memo.preventClose) {
          closeLangMenu();
        }
      };
      const detectEsc = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape') {
          closeLangMenu();
        }
      };
      document.addEventListener('mouseup', closeMenu);
      document.addEventListener('keydown', detectEsc);
      return () => {
        document.removeEventListener('mouseup', closeMenu);
        document.removeEventListener('keydown', detectEsc);
      };
    }
  }, [memo, isLangMenuOpen, closeLangMenu]);

  const FullScreenIcon = isFullscreen ? Minimize : Maximize;

  const langMenu = React.useMemo(
    () => (
      <div
        className={cn(
          isDev && '__LangMenu', // DEBUG
          'focus:outline-hidden absolute z-40 rounded-md',
          'left-0 mb-42 w-64 origin-bottom',
          'flex flex-col gap-2 p-2',
          'bg-blue-500 shadow-lg ring-1 ring-black/5',
          'cursor-default',
          !isLangMenuOpen && 'hidden',
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
        onMouseUp={(ev) => {
          memo.preventClose = true;
          setTimeout(() => {
            memo.preventClose = false;
          }, 100);
          ev.stopPropagation();
          ev.preventDefault();
        }}
      >
        {usedLanguages.map((lang) => (
          <span
            key={lang}
            className={cn(
              isDev && '__ProgressNav_LangMenu_Item', // DEBUG
              'btn btn-primary btn-plain btn-sm-text flex',
              lang === language && 'disabled',
            )}
            onClick={() => switchLanguage(lang)}
          >
            {lang} {languageNames[lang]}
          </span>
        ))}
      </div>
    ),
    [memo, isLangMenuOpen, language, switchLanguage],
  );

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
      {allowedLanguageSwitch && (
        <NavIcon
          className={cn(
            isDev && '__ProgressNav_Lang', // DEBUG
            'bg-blue-500',
            'relative',
          )}
          title={isLangMenuOpen ? 'Hide language menu' : 'Show language menu'}
          onClick={() => {
            if (!memo.preventClose) {
              toggleLangMenu(!isLangMenuOpen);
            }
          }}
        >
          <span className="text-lg text-white uppercase">{language}</span>
          {langMenu}
        </NavIcon>
      )}
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
        'size-[2em]',
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
