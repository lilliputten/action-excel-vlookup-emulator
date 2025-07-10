import React from 'react';

import { initalProgressStep, ProgressSteps, progressStepsCount } from './ProgressSteps';

type TSetProgressStepAction = React.Dispatch<React.SetStateAction<ProgressSteps>>;

export interface TProgressContext {
  // Core data
  step: ProgressSteps;
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

  const setFirstStep = React.useCallback(() => setStep(0), []);
  const setLastStep = React.useCallback(() => setStep(progressStepsCount - 1), []);
  const setNextStep = React.useCallback(
    () =>
      setStep((step) => {
        if (step < progressStepsCount - 1) {
          return step + 1;
        }
        return step;
      }),
    [],
  );
  const setPrevStep = React.useCallback(
    () =>
      setStep((step) => {
        if (step > 0) {
          return step - 1;
        }
        return step;
      }),
    [],
  );
  // Properties...
  const isFirstStep = React.useMemo(() => step <= 0, [step]);
  const isLastStep = React.useMemo(() => step >= progressStepsCount - 1, [step]);
  const progressContext = React.useMemo<TProgressContext>(
    () =>
      ({
        // Core data
        step,
        stepsCount: progressStepsCount,
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
