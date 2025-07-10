import { isDev } from '@/config';

export enum ProgressSteps {
  StepStart,
  StepEquationStart,
  StepSelectSourceColunn,
  StepEquationSemicolon,
  StepSelectLookupRangeStart,
  StepEquationFinish,
  StepExtendResults,
  StepDone,
}

/** Progress steps order */
export const progressStepsSequence = [
  ProgressSteps.StepStart,
  ProgressSteps.StepEquationStart,
  ProgressSteps.StepSelectSourceColunn,
  ProgressSteps.StepEquationSemicolon,
  ProgressSteps.StepSelectLookupRangeStart,
  ProgressSteps.StepEquationFinish,
  ProgressSteps.StepExtendResults,
  ProgressSteps.StepDone,
];

const __useDebug = false;
export const initalProgressStep =
  __useDebug && isDev
    ? ProgressSteps.StepSelectLookupRangeStart // DEBUG
    : ProgressSteps.StepStart;
