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

import {
  allowedLanguageSwitch,
  languageNames,
  TLng,
  usedLanguages,
  useLanguage,
} from '@/config/lang';
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

  const { i18n, t } = useTranslation();
  const lng = useLanguage();

  React.useEffect(() => {
    setShowHelp(true);
    setTimeout(() => setShowHelp(false), helpMessageDelay);
  }, [step]);

  const { text, textClassName } = useStepData(lng);

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
    (lng: TLng) => {
      closeLangMenu();
      i18n.changeLanguage(lng);
      window.history.replaceState({}, '', '?' + lng); // A method to update location search string
    },
    [i18n, closeLangMenu],
  );

  React.useEffect(() => {
    if (isLangMenuOpen) {
      const closeMenu = () => {
        if (!memo.preventClose) {
          closeLangMenu();
          memo.preventClose = true;
          setTimeout(() => {
            memo.preventClose = false;
          }, 100);
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
          'left-0 mb-45 w-64 origin-bottom',
          'flex flex-col gap-2 p-2',
          'bg-blue-500 shadow-lg ring-1 ring-black/5',
          'cursor-default',
          'after:border-blue-500 after:absolute after:-bottom-1 after:left-[18px] after:h-0 after:w-0 after:-translate-x-1/2 after:rotate-45 after:border-4 after:content-[""]',
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
        title={t('select-language')}
      >
        {usedLanguages.map((lang) => (
          <span
            key={lang}
            className={cn(
              isDev && '__ProgressNav_LangMenu_Item', // DEBUG
              'btn btn-sm-text flex hover:bg-blue-600',
              lang === lng && 'disabled',
            )}
            onClick={() => switchLanguage(lang)}
          >
            {lang} {languageNames[lang]}
          </span>
        ))}
      </div>
    ),
    [memo, isLangMenuOpen, lng, switchLanguage, t],
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
            'bg-blue-500 hover:bg-blue-600',
          )}
          disabled={isFirstStep}
          title={t('predydushii-shag')}
          onClick={setPrevStep}
        >
          <ChevronLeft size="2em" />
        </NavIcon>
      )}
      {!isFirstStep && (
        <NavIcon
          className={cn(
            isDev && '__ProgressNav_Replay', // DEBUG
            'bg-blue-500 hover:bg-blue-600',
          )}
          title={t('nachat-snachala')}
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
          'bg-blue-500 hover:bg-blue-600',
        )}
        title={t('polnoekrannyi-rezhim')}
        onClick={toggleFullscreen}
      >
        <FullScreenIcon size="2em" />
      </NavIcon>
      {allowedLanguageSwitch && (
        <NavIcon
          className={cn(
            isDev && '__ProgressNav_Lang', // DEBUG
            'bg-blue-500 hover:bg-blue-600',
            isLangMenuOpen && 'bg-blue-600',
            'relative',
          )}
          title={isLangMenuOpen ? t('hide-language-menu') : t('show-language-menu')}
          onClick={() => {
            if (!memo.preventClose) {
              toggleLangMenu(!isLangMenuOpen);
            }
          }}
        >
          <span className="text-lg text-white uppercase">{lng}</span>
          {langMenu}
        </NavIcon>
      )}
      <NavIcon
        className={cn(
          isDev && '__ProgressNav_Help', // DEBUG
          'bg-teal-500 hover:bg-teal-600',
        )}
        disabled={!helpMessage || showHelp}
        title={t('tekst-podskazki-dlya-dannogo-shaga')}
        onClick={handleShowHelp}
      >
        <Info size="2em" />
      </NavIcon>
      {!isLastStep && (
        <NavIcon
          className={cn(
            isDev && '__ProgressNav_NextStep', // DEBUG
            'bg-blue-500 hover:bg-blue-600',
          )}
          disabled={!canGoForward && !allowedNextStep}
          title={t('sleduyushii-shag')}
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
        // 'hover:opacity-80',
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
  const { t } = useTranslation();
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
        <span className="sm:font-bold sm:opacity-50">
          {t('step')} {step + 1}
          <span className="max-sm:hidden">:</span>
        </span>{' '}
        <span className="pl-1 max-sm:hidden">{text}</span>
      </div>
    </div>
  );
}
