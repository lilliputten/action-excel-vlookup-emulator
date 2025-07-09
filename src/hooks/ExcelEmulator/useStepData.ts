import { stepsData } from '@/constants/ExcelEmulator/stepsData';
import { useProgressContext } from '@/contexts/ProgressContext';

export function useStepData() {
  const { step } = useProgressContext();
  return stepsData[step];
}
