import React from 'react';

import { Fireworks, TInitOptions } from '@/lib/Fireworks/Fireworks';
import { isDev } from '@/config';
import { cn } from '@/lib';

type TTimeout = NodeJS.Timeout | undefined;

interface TStartFireworksParams {
  x?: number;
  y?: number;
  isContinuous?: boolean;
}

export interface TFireworksContext {
  inited: boolean;
  startFireworks: (params?: TStartFireworksParams) => void;
  stopFireworks: () => void;
}

const FireworksContext = React.createContext<TFireworksContext>({} as TFireworksContext);

interface TMemo {
  handler?: TTimeout;
}

export const useCreateFireworksContext = () => {
  const memo = React.useMemo<TMemo>(() => ({}), []);
  const [inited, setInited] = React.useState(false);

  React.useEffect(() => {
    Fireworks.init('FireworksContainer', {
      frequency: 50,
      launch_speed: 10,
      explode_particles_resistance: 5,
      zIndex: 20, // Ensure it's above the background
      debris_num: Number(import.meta.env.VITE_FIREWORKS_DEBRIS_NUM) || 10,
      rockets_num: Number(import.meta.env.VITE_FIREWORKS_ROCKETS_NUM) || 5,
    } satisfies TInitOptions);
    setInited(true);
  }, []);

  const stopFireworks = React.useCallback(() => {
    if (memo.handler) {
      clearTimeout(memo.handler);
      memo.handler = undefined;
      Fireworks.stop();
    }
  }, [memo]);

  const startFireworks = React.useCallback(
    (params?: TStartFireworksParams) => {
      stopFireworks();
      const x = params?.x;
      const y = params?.y;
      const isContinuous = params?.isContinuous;
      const timeout = isContinuous ? 15000 : 5000;
      Fireworks.start(x, y, isContinuous);
      memo.handler = setTimeout(stopFireworks, timeout);
    },
    [memo, stopFireworks],
  );

  return React.useMemo<TFireworksContext>(
    () => ({ inited, startFireworks, stopFireworks }) satisfies TFireworksContext,
    [inited, startFireworks, stopFireworks],
  );
};

interface TFireworksContextProviderProps {
  children: React.ReactNode;
}

export const FireworksContextProvider = (props: TFireworksContextProviderProps) => {
  const { children } = props;
  const fireworksContext = useCreateFireworksContext();
  return (
    <FireworksContext.Provider value={fireworksContext}>
      {/* Nested components */}
      {children}
      <div
        id="FireworksContainer"
        className={cn(
          isDev && '__FireworksContainer1', // DEBUG
          'fixed inset-0 z-20',
          'pointer-events-none',
        )}
      />
    </FireworksContext.Provider>
  );
};

export function useFireworksContext() {
  const fireworksContext = React.useContext(FireworksContext);
  if (!fireworksContext) {
    throw new Error('Use FireworksContext with a provider!');
  }
  return fireworksContext;
}
