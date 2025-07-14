import i18next from 'i18next';

import { TLng } from '@/config/lang';
import {
  inputCellName,
  lookupRangeFirstCellName,
  lookupRangeLastCellName,
  sourceCellName,
  substrCellName,
  targetRangeFirstCellName,
  targetRangeLastCellName,
} from '@/constants/ExcelEmulator/table';
import { ProgressSteps } from '@/contexts/ProgressSteps';
import { TCellName } from '@/types/ExcelEmulator';
import { TReactNode } from '@/types/react';

const { t } = i18next;

interface TStepsDataItem {
  text: string;
  textClassName?: string;
  // State
  onEnterMessage?: string;
  // Click
  clickCellName?: TCellName;
  clickCellClassName?: string;
  clickWrongCellMessage?: string;
  clickCorrectCellMessage?: string;
  // Selection
  selectionStartCellName?: TCellName;
  selectionStartCellClassName?: string;
  selectionFinishCellName?: TCellName;
  selectionFinishCellClassName?: string;
  selectionSuccessMessage?: string;
  selectionErrorMessage?: string;
  // Hint tooltip cell
  hintCellName?: TCellName;
  hintCellClassName?: string;
  hintContent?: TReactNode;
  hintClassName?: string;
}

type TStepsData = Record<ProgressSteps, TStepsDataItem>;
const cachedStepsData: Partial<Record<TLng, TStepsData>> = {};

function createStepsData(lng: TLng) {
  const stepsData: TStepsData = {
    [ProgressSteps.StepStart]: {
      text: t('vyberite-yacheiku-dlya-vvoda-formuly', { lng }),
      onEnterMessage: t('vyberite-yacheiku-v-kotoruyu-budete-vvodit-formulu', { lng }),
      hintCellName: inputCellName,
      hintContent: t('nachnite-vvodit-formulu-v-etu-yacheiku', { lng }),
      hintClassName: 'whitespace-nowrap',
      hintCellClassName: 'animated-background',
    },
    [ProgressSteps.StepEquationStart]: {
      text: t('nachnite-vvodit-formulu-v-yacheiku', { lng }),
      onEnterMessage: t('vvedite-nachalo-formuly', { lng }),
      hintClassName: 'whitespace-nowrap',
    },
    [ProgressSteps.StepSelectSourceColumn]: {
      text: t('vyberite-iskhodnyi-stolbec', { lng }),
      onEnterMessage: t('kliknite-po-yacheike-s-dannymi-dlya-sravneniya', { lng }),
      clickCellName: sourceCellName, // 'B6',
      clickCorrectCellMessage: t('vybrana-iskhodnaya-yacheika', { lng }) + sourceCellName + '.',
    },
    [ProgressSteps.StepEquationDelim]: {
      text: t('prodolzhite-redaktirovanie-formuly', { lng }),
      onEnterMessage: t('dobavte-razdelitel-v-formulu', { lng }),
    },
    [ProgressSteps.StepSelectLookupRange]: {
      text: t('vydelite-ili-vvedite-diapazon-dlya-poiska', { lng }),
      onEnterMessage: t('vyberite-diapazon-dlya-poiska', { lng }),
      selectionStartCellName: lookupRangeFirstCellName,
      selectionFinishCellName: lookupRangeLastCellName,
    },
    [ProgressSteps.StepEditLookupRange]: {
      text: t('zakrepite-diapazon-poiska-v-formule', { lng }),
      onEnterMessage: t('zakrepite-adresa-yacheek-diapazona-poiska', { lng }),
    },
    [ProgressSteps.StepAddColumnNumber]: {
      text: t('dobavte-nomer-stolbca', { lng }),
      onEnterMessage: t('dobavte-cherez-razdelitel-nomer-stolbca-v-formulu', { lng }),
    },
    [ProgressSteps.StepAddInterval]: {
      text: t('dobavte-znachenie-intervalnogo-prosmotra', { lng }),
      onEnterMessage: t('dobavte-cherez-razdelitel-znachenie-intervalnogo-prosmotra', { lng }),
    },
    [ProgressSteps.StepFinishEquation]: {
      text: t('zakonchite-redaktirovanie-formuly', { lng }),
      onEnterMessage: t('zakroite-skobku', { lng }),
    },
    [ProgressSteps.StepExtendRawResults]: {
      text: t('rastyanite-yacheiku-s-rezultatami', { lng }),
      onEnterMessage: t('rastyanite-yacheiku-s-rezultatom-vniz-chtoby-uvidet-vse-dannye', { lng }),
      selectionStartCellName: targetRangeFirstCellName,
      selectionFinishCellName: targetRangeLastCellName,
      selectionSuccessMessage: t('yacheika-s-rezultatami-rastyanuta', { lng }),
      selectionErrorMessage: t('nuzhno-rastyanut-yacheiku-na-vysotu-vsekh-strok-s-dannymi', {
        lng,
      }),
    },
    [ProgressSteps.StepSelectEquatonAgain]: {
      text: t('eshyo-raz-otredaktiruite-yacheiku-s-formuloi', { lng }),
      onEnterMessage: t('kliknite-po-yacheike-s-formuloi-chtoby-dobavit-vychitanie-stolbcov', {
        lng,
      }),
      hintCellName: inputCellName,
      hintContent: t('kliknite-po-yacheike-eshyo-raz', { lng }),
      hintClassName: 'whitespace-nowrap',
    },
    [ProgressSteps.StepAddSubstrColumn]: {
      clickCellName: substrCellName, // 'D6',
      clickCorrectCellMessage:
        t('vybrana-yacheika-dlya-vychitaniya', { lng }) + substrCellName + '.',
      text: t('dopolnite-formulu-adresom-stolbca-dlya-vychitaniya', { lng }),
      onEnterMessage: t('vyberite-stolbec-to-substract', { lng }),
    },
    [ProgressSteps.StepExtendFinalResults]: {
      text: t('rastyanite-yacheiku-s-rezultatami-eshyo-raz', { lng }),
      onEnterMessage: t('rastyanite-yacheiku-s-rezultatom-vniz-eshyo-raz', { lng }),
      selectionStartCellName: targetRangeFirstCellName,
      selectionFinishCellName: targetRangeLastCellName,
      selectionSuccessMessage: t('yacheika-s-rezultatami-rastyanuta', { lng }),
      selectionErrorMessage: t('nuzhno-rastyanut-yacheiku-na-vysotu-vsekh-strok-s-dannymi', {
        lng,
      }),
    },
    [ProgressSteps.StepDone]: {
      text: t('vse-zadachi-vypolneny', { lng }),
      textClassName: 'bg-green-500',
    },
  };
  return stepsData;
}

export function getStepsData(lng: TLng) {
  if (!cachedStepsData[lng]) {
    cachedStepsData[lng] = createStepsData(lng);
  }
  return cachedStepsData[lng] as TStepsData;
}
