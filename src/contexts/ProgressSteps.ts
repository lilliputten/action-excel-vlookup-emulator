import { TLng } from '@/config/lang';
import { isDev } from '@/config';
import {
  editedLookupRangeName,
  expectedColumnNumber,
  expectedIntervalValue,
  getEquationBegin,
  getEquationDelim,
  lookupRangeName,
  sourceCellName,
  substrCellName,
} from '@/constants/ExcelEmulator';

export enum ProgressSteps {
  StepStart,
  StepEquationStart,
  StepSelectSourceColumn,
  StepEquationDelim,
  StepSelectLookupRange,
  StepEditLookupRange,
  StepAddColumnNumber,
  StepAddInterval,
  StepFinishEquation,
  StepExtendRawResults,
  StepSelectEquatonAgain,
  StepAddSubstrColumn,
  StepExtendFinalResults,
  StepDone,
}
export const progressStepsCount = Math.floor(
  // NOTE: The enum keys contain both key names and values
  Object.keys(ProgressSteps).length / 2,
);

const stepValuesByLang: Partial<Record<TLng, string[]>> = {};

function createStepValuesByLang(lang: TLng) {
  const begin = getEquationBegin(lang);
  const delim = getEquationDelim(lang);
  /** Default (failback/test) values on start of each step */
  const stepValues: string[] = [
    ``, // StepStart
    ``, // StepEquationStart
    `${begin}`, // StepSelectSourceColumn
    `${begin}${sourceCellName}`, // StepEquationDelim
    `${begin}${sourceCellName}${delim}`, // StepSelectLookupRange
    `${begin}${sourceCellName}${delim}${lookupRangeName}`, // StepEditLookupRange
    `${begin}${sourceCellName}${delim}${editedLookupRangeName}`, // StepAddColumnNumber
    `${begin}${sourceCellName}${delim}${editedLookupRangeName}${delim}${expectedColumnNumber}`, // StepAddInterval
    `${begin}${sourceCellName}${delim}${editedLookupRangeName}${delim}${expectedColumnNumber}${delim}${expectedIntervalValue}`, // StepFinishEquation
    `${begin}${sourceCellName}${delim}${editedLookupRangeName}${delim}${expectedColumnNumber}${delim}${expectedIntervalValue})`, // StepExtendRawResults
    `${begin}${sourceCellName}${delim}${editedLookupRangeName}${delim}${expectedColumnNumber}${delim}${expectedIntervalValue})`, // StepSelectEquatonAgain
    `${begin}${sourceCellName}${delim}${editedLookupRangeName}${delim}${expectedColumnNumber}${delim}${expectedIntervalValue})`, // StepAddSubstrColumn
    `${begin}${sourceCellName}${delim}${editedLookupRangeName}${delim}${expectedColumnNumber}${delim}${expectedIntervalValue})-${substrCellName}`, // StepExtendFinalResults
    `${begin}${sourceCellName}${delim}${editedLookupRangeName}${delim}${expectedColumnNumber}${delim}${expectedIntervalValue})-${substrCellName}`, // StepDone
  ];
  return stepValues;
}

function getStepValuesByLang(lang: TLng) {
  if (!stepValuesByLang[lang]) {
    stepValuesByLang[lang] = createStepValuesByLang(lang);
  }
  return stepValuesByLang[lang] as string[];
}

export function getInitialStepValue(step: ProgressSteps, lang: TLng) {
  const stepValues = getStepValuesByLang(lang);
  return stepValues[step];
}
export function getExpectedStepValue(step: ProgressSteps, lang: TLng) {
  const stepValues = getStepValuesByLang(lang);
  step = Math.min(stepValues.length, step + 1);
  return stepValues[step];
}
export function useInitialStepValue(step: ProgressSteps, lang: TLng) {
  return getInitialStepValue(step, lang);
}
export function useExpectedStepValue(step: ProgressSteps, lang: TLng) {
  return getExpectedStepValue(step, lang);
}

const __useDebug = true;
export const initalProgressStep =
  __useDebug && isDev
    ? ProgressSteps.StepAddColumnNumber // DEBUG: Inital step, for debug purposes
    : ProgressSteps.StepStart;
