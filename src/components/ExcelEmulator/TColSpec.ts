import { TReactNode } from '@/types/react';

export interface TColSpec {
  colSpan?: number;
  className?: string;
  content?: TReactNode;
}
export type TOptionalColSpec = TColSpec | undefined | null;
