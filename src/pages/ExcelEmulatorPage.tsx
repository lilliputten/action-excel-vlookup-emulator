import { ExcelEmulatorScreen } from '@/components/ExcelEmulator/ExcelEmulatorScreen';
import { ProgressContextProvider } from '@/contexts/ProgressContext';
import { SelectionContextProvider } from '@/contexts/SelectionContext';

export function ExcelEmulatorPage() {
  return (
    <ProgressContextProvider>
      <SelectionContextProvider>
        {/* Nested components */}
        <ExcelEmulatorScreen />
      </SelectionContextProvider>
    </ProgressContextProvider>
  );
}
