import { TReactNode } from '@/types/react';

export interface TColSpec {
  width?: string | number;
  colSpan?: number;
  className?: string;
  content?: TReactNode;
}
export type TOptionalColSpec = TColSpec | undefined | null;
