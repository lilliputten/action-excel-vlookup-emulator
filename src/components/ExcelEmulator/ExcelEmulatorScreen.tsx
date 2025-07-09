import { isDev } from '@/config';
import { cn } from '@/lib';

import { useProgressContext } from './ProgressContext';
import { Table } from './Table';

export function ExcelEmulatorScreen() {
  const { setNextStep } = useProgressContext();
  return (
    <div
      className={cn(
        isDev && '__ExcelEmulator', // DEBUG
      )}
      onClick={() => {
        console.log('[ExcelEmulatorScreen:onClick]');
        setNextStep();
      }}
    >
      <Table />
    </div>
  );
}
