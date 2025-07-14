import { useLanguage } from '@/config/lang';
import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import { cn } from '@/lib';
import { TPropsWithClassName } from '@/types/react';

interface TToolTipProps extends TPropsWithClassName {
  id?: string;
  children?: React.ReactNode;
  isError?: boolean;
}

export function ToolTip(props: TToolTipProps) {
  const { id, className, isError, children } = props;

  if (!children) {
    return null;
  }

  return (
    <div
      data-id={id}
      className={cn(
        isDev && '__ToolTip', // DEBUG
        'absolute',
        // !isDev && 'pointer-events-none',
        'px-4 py-2',
        '-translate-x-9/20',
        'translate-y-[12px]',
        'rounded-lg shadow-lg/30',
        'text-white',
        isError ? 'bg-red-500 after:border-red-500' : 'bg-blue-500 after:border-blue-500',
        'after:absolute after:-top-1 after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:rotate-45 after:border-4 after:content-[""]',
        'cursor-default',
        'z-[10]',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function HintToolTip(props: TToolTipProps) {
  const { id, className } = props;
  const lng = useLanguage();
  const { hintContent, hintClassName } = useStepData(lng);

  const tooltipContent = hintContent;
  const tooltipClassName = hintClassName;

  if (!hintContent) {
    return null;
  }

  return (
    <ToolTip
      id={id || 'HintToolTip'}
      className={cn(
        isDev && '__ToolTip', // DEBUG
        tooltipClassName,
        className,
      )}
    >
      {tooltipContent}
    </ToolTip>
  );
}
