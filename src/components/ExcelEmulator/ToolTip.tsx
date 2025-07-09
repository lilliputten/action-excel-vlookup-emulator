import { useStepData } from '@/hooks/ExcelEmulator/useStepData';
import { isDev } from '@/config';
import { cn } from '@/lib';
import { TPropsWithClassName } from '@/types/react';

type TToolTipProps = TPropsWithClassName;

export function ToolTip(props: TToolTipProps) {
  const { className } = props;
  const { hintContent, hintClassName } = useStepData();

  if (!hintContent) {
    return null;
  }

  return (
    <div
      className={cn(
        isDev && '__ToolTip', // DEBUG
        'absolute',
        // 'pointer-events-none',
        'px-4 py-2',
        '-translate-x-9/20',
        'translate-y-[12px]',
        'rounded-lg shadow-lg/30',
        'bg-blue-500 text-white',
        'after:border-blue-500',
        'after:absolute after:-top-1 after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:rotate-45 after:border-4 after:content-[""]',
        'z-[10]',
        // 'w-[200%]', // Extension style
        className,
        hintClassName,
      )}
    >
      {hintContent}
    </div>
  );
}
