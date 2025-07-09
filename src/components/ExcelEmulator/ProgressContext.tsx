import React from 'react';

export enum ProgressSteps {
  Start = 'Start',
  EnterEquation = 'EnterEquation',
}

/** Prgress steps order */
export const progressStepsSequence = [
  // The order of steps
  ProgressSteps.Start,
  ProgressSteps.EnterEquation,
];
const stepsCount = progressStepsSequence.length;

type TSetProgressStepAction = React.Dispatch<React.SetStateAction<ProgressSteps>>;

interface TProgressContext {
  step: ProgressSteps;
  stepIndex: number;
  stepsCount: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  setStep: TSetProgressStepAction;
  setFirstStep: () => void;
  setNextStep: () => void;
  setPrevStep: () => void;
  setLastStep: () => void;
}

const ProgressContext = React.createContext<TProgressContext>({} as TProgressContext);

export const useCreateProgressContext = () => {
  const [step, setStep] = React.useState(ProgressSteps.Start);
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
  const context = React.useMemo<TProgressContext>(
    () =>
      ({
        step,
        stepIndex,
        stepsCount,
        isFirstStep,
        isLastStep,
        setStep,
        setFirstStep,
        setLastStep,
        setNextStep,
        setPrevStep,
      }) satisfies TProgressContext,
    [
      step,
      stepIndex,
      isFirstStep,
      isLastStep,
      setStep,
      setFirstStep,
      setLastStep,
      setNextStep,
      setPrevStep,
    ],
  );
  return context;
};

interface TProgressContextProviderProps {
  children: React.ReactNode;
}

export const ProgressContextProvider = (props: TProgressContextProviderProps) => {
  const { children } = props;
  const context = useCreateProgressContext();
  return (
    <ProgressContext.Provider value={context}>
      {/* Nested components */}
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgressContext() {
  const context = React.useContext(ProgressContext);
  if (!context) {
    throw new Error('Use ProgressContext with a provider!');
  }
  return context;
}
