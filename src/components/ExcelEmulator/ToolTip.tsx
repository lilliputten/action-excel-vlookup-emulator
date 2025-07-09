import { isDev } from '@/config';
import { cn } from '@/lib';
import { TPropsWithClassName } from '@/types/react';

interface TToolTipProps extends TPropsWithClassName {
  ///
}

export function ToolTip(props: TToolTipProps) {
  const { className } = props;

  return (
    <div
      className={cn(
        isDev && '__ToolTip', // DEBUG
        'absolute',
        // 'pointer-events-none',
        'px-4 py-2',
        '-translate-x-1/2',
        'translate-y-[20px]',
        'rounded-lg shadow-lg/30',
        'bg-blue-500 text-white',
        'after:border-blue-500',
        'after:absolute after:-top-1 after:left-1/2 after:h-0 after:w-0 after:-translate-x-1/2 after:rotate-45 after:border-4 after:content-[""]',
        'z-[10]',
        'w-[200%]', // Extension style
        className,
      )}
    >
      Длинный текст тултипа с переносом строк.
    </div>
  );
}
