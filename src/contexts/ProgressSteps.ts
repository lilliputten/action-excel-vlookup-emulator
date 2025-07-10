import { isDev } from '@/config';

export enum ProgressSteps {
  StepStart,
  StepEquationStart,
  StepSelectSourceColumn,
  StepEquationSemicolon,
  StepSelectLookupRange,
  StepAddColumnNumber,
  StepAddInterval,
  StepFinishEquation,
  StepExtendResults,
  StepDone,
}

/** Progress steps order */
export const progressStepsSequence = [
  ProgressSteps.StepStart,
  ProgressSteps.StepEquationStart,
  ProgressSteps.StepSelectSourceColumn,
  ProgressSteps.StepEquationSemicolon,
  ProgressSteps.StepSelectLookupRange,
  ProgressSteps.StepAddColumnNumber,
  ProgressSteps.StepAddInterval,
  ProgressSteps.StepFinishEquation,
  ProgressSteps.StepExtendResults,
  ProgressSteps.StepDone,
];

const __useDebug = false;
export const initalProgressStep =
  __useDebug && isDev
    ? ProgressSteps.StepSelectLookupRange // DEBUG
    : ProgressSteps.StepStart;
