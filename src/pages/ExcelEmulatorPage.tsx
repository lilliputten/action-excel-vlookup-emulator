import { ExcelEmulatorScreen } from '@/components/ExcelEmulator/ExcelEmulatorScreen';
import { FireworksContextProvider } from '@/contexts/FireworksContext';
import { ProgressContextProvider } from '@/contexts/ProgressContext';
import { SelectionContextProvider } from '@/contexts/SelectionContext';

export function ExcelEmulatorPage() {
  return (
    <FireworksContextProvider>
      <ProgressContextProvider>
        <SelectionContextProvider>
          {/* Nested components */}
          <ExcelEmulatorScreen />
        </SelectionContextProvider>
      </ProgressContextProvider>
    </FireworksContextProvider>
  );
}
