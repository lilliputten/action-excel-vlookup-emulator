import { isDev } from '@/config';
import { cn } from '@/lib';

import { Table } from './Table';

export function ExcelPage() {
  return (
    <div
      className={cn(
        isDev && '__ExcelPage', // DEBUG
      )}
    >
      <Table />
    </div>
  );
}
