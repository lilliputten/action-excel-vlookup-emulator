import { TPropsWithClassName, TReactNode } from '@/types/react';

export interface TBasicCellProps {
  id?: string;
  ruler?: boolean;
  header?: boolean;
}
export interface TTableRowProps extends TPropsWithClassName, TBasicCellProps {
  rowIndex: number;
}
export interface TTableCellProps extends TPropsWithClassName, TBasicCellProps {
  colIndex: number;
  rowIndex: number;
  spanCount?: number;
  onClick?: React.EventHandler<React.MouseEvent<HTMLTableCellElement>>;
  children?: TReactNode;
  style?: React.CSSProperties;
}
