import React from 'react';

import { initalProgressStep, ProgressSteps, progressStepsSequence } from './ProgressSteps';

const stepsCount = progressStepsSequence.length;

type TSetProgressStepAction = React.Dispatch<React.SetStateAction<ProgressSteps>>;

export interface TProgressContext {
  // Core data
  step: ProgressSteps;
  stepIndex: number;
  stepsCount: number;
  // Derived properties
  isFirstStep: boolean;
  isLastStep: boolean;
  // Actions
  setStep: TSetProgressStepAction;
  setFirstStep: () => void;
  setNextStep: () => void;
  setPrevStep: () => void;
  setLastStep: () => void;
  // Can go forward?
  allowedNextStep: boolean;
  goggleAllowedNextStep: React.Dispatch<React.SetStateAction<boolean>>;
  allowNextStep: () => void;
  disallowNextStep: () => void;
}

const ProgressContext = React.createContext<TProgressContext>({} as TProgressContext);

export const useCreateProgressContext = () => {
  const [step, setStep] = React.useState(initalProgressStep);
  const [allowedNextStep, goggleAllowedNextStep] = React.useState(false);

  const allowNextStep = React.useCallback(() => goggleAllowedNextStep(true), []);
  const disallowNextStep = React.useCallback(() => goggleAllowedNextStep(false), []);
  React.useEffect(() => {
    // TODO: Check conditions
    goggleAllowedNextStep(false);
  }, [step]);
  const stepIndex = React.useMemo(() => progressStepsSequence.indexOf(step), [step]);

  const setFirstStep = React.useCallback(() => setStep(progressStepsSequence[0]), []);
  const setLastStep = React.useCallback(() => setStep(progressStepsSequence[stepsCount - 1]), []);
  const setNextStep = React.useCallback(
    () =>
      setStep((step) => {
        const idx = progressStepsSequence.indexOf(step);
        if (idx !== -1 && idx < stepsCount - 1) {
          return progressStepsSequence[idx + 1];
        }
        return step;
      }),
    [],
  );
  const setPrevStep = React.useCallback(
    () =>
      setStep((step) => {
        const idx = progressStepsSequence.indexOf(step);
        if (idx !== -1 && idx > 0) {
          return progressStepsSequence[idx - 1];
        }
        return step;
      }),
    [],
  );
  // Properties...
  const isFirstStep = React.useMemo(() => stepIndex <= 0, [stepIndex]);
  const isLastStep = React.useMemo(() => stepIndex >= stepsCount - 1, [stepIndex]);
  const progressContext = React.useMemo<TProgressContext>(
    () =>
      ({
        // Core data
        step,
        stepIndex,
        stepsCount,
        // Derived properties
        isFirstStep,
        isLastStep,
        // Actions
        setStep,
        setFirstStep,
        setLastStep,
        setNextStep,
        setPrevStep,
        // Can go forward?
        allowedNextStep,
        goggleAllowedNextStep,
        allowNextStep,
        disallowNextStep,
      }) satisfies TProgressContext,
    [
      // Core data
      step,
      stepIndex,
      // Derived properties
      isFirstStep,
      isLastStep,
      // Actions
      setStep,
      setFirstStep,
      setLastStep,
      setNextStep,
      setPrevStep,
      // Can go forward?
      allowedNextStep,
      goggleAllowedNextStep,
      allowNextStep,
      disallowNextStep,
    ],
  );
  return progressContext;
};

interface TProgressContextProviderProps {
  children: React.ReactNode;
}

export const ProgressContextProvider = (props: TProgressContextProviderProps) => {
  const { children } = props;
  const progressContext = useCreateProgressContext();
  return (
    <ProgressContext.Provider value={progressContext}>
      {/* Nested components */}
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgressContext() {
  const progressContext = React.useContext(ProgressContext);
  if (!progressContext) {
    throw new Error('Use ProgressContext with a provider!');
  }
  return progressContext;
}
