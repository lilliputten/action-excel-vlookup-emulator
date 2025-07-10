import { ProgressNav } from '@/components/ProgressNav';
import { isDev } from '@/config';
import { cn } from '@/lib';

import { Table } from './Table';

export function ExcelEmulatorScreen() {
  return (
    <div
      className={cn(
        isDev && '__ExcelEmulator', // DEBUG
      )}
    >
      <Table />
      <ProgressNav />
    </div>
  );
}
