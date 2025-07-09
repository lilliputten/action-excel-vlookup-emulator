import { ExcelEmulatorScreen } from '@/components/ExcelEmulator/ExcelEmulatorScreen';
import { ProgressContextProvider } from '@/components/ExcelEmulator/ProgressContext';

export function ExcelEmulatorPage() {
  return (
    <ProgressContextProvider>
      {/* Nested components */}
      <ExcelEmulatorScreen />
    </ProgressContextProvider>
  );
}
