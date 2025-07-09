import { ExcelEmulatorScreen } from '@/components/ExcelEmulator/ExcelEmulatorScreen';
import { ProgressContextProvider } from '@/contexts/ProgressContext';

export function ExcelEmulatorPage() {
  return (
    <ProgressContextProvider>
      {/* Nested components */}
      <ExcelEmulatorScreen />
    </ProgressContextProvider>
  );
}
