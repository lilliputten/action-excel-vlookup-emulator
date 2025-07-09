import React from 'react';

export interface TSelectionContext {
  // Data
  selecting: boolean;
  finished: boolean;
  selectionStart?: HTMLDivElement;
  selectionFinish?: HTMLDivElement;
  // Setters
  setSelecting: React.Dispatch<React.SetStateAction<boolean>>;
  setFinished: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectionStart: React.Dispatch<React.SetStateAction<HTMLDivElement | undefined>>;
  setSelectionFinish: React.Dispatch<React.SetStateAction<HTMLDivElement | undefined>>;
}

const SelectionContext = React.createContext<TSelectionContext>({} as TSelectionContext);

export const useCreateSelectionContext = () => {
  const [selecting, setSelecting] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const [selectionStart, setSelectionStart] = React.useState<HTMLDivElement | undefined>();
  const [selectionFinish, setSelectionFinish] = React.useState<HTMLDivElement | undefined>();

  const selectionContext = React.useMemo<TSelectionContext>(
    () =>
      ({
        // Data
        selecting,
        finished,
        selectionStart,
        selectionFinish,
        // Setters
        setSelecting,
        setFinished,
        setSelectionStart,
        setSelectionFinish,
      }) satisfies TSelectionContext,
    [
      // Data
      selecting,
      finished,
      selectionStart,
      selectionFinish,
      // Setters
      setSelecting,
      setFinished,
      setSelectionStart,
      setSelectionFinish,
    ],
  );
  return selectionContext;
};

interface TSelectionContextProviderProps {
  children: React.ReactNode;
}

export const SelectionContextProvider = (props: TSelectionContextProviderProps) => {
  const { children } = props;
  const selectionContext = useCreateSelectionContext();
  return (
    <SelectionContext.Provider value={selectionContext}>
      {/* Nested components */}
      {children}
    </SelectionContext.Provider>
  );
};

export function useSelectionContext() {
  const selectionContext = React.useContext(SelectionContext);
  if (!selectionContext) {
    throw new Error('Use SelectionContext with a provider!');
  }
  return selectionContext;
}
