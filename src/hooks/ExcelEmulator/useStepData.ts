import { TLng } from '@/config/lang';
import { getStepsData } from '@/constants/ExcelEmulator/stepsData';
import { useProgressContext } from '@/contexts/ProgressContext';

export function useStepData(lng: TLng) {
  const { step } = useProgressContext();
  return getStepsData(lng)[step];
}
