
import { ROW_MODES } from '../constants/rowModes';

export type TNewTableRowMode = keyof typeof ROW_MODES //'edit' | 'view' | 'delete' | 'custom';

export interface IId {
  id: string | number
}

export interface ILocalNewTableRowDataCommon extends IId {
  [key: string]: any
}

export interface INewTableRowAction {
  eventName: string;
  icon?: string;
  label?: string;
  modes?: TNewTableRowMode[];
}

export interface INewTableRowMeta {
  rowType?: string | number;
  class?: string;
}

export interface INewTableRowCommonMeta {
  rowType?: string | number;
  class?: Record<string, string>;
}

export interface INewTableRowTemplate<T extends Record<string, any>> {
  meta: INewTableRowMeta;
  data: T;
  children?: INewTableRowTemplate<T>[];
  actions?: Record<string, INewTableRowAction>;
  __level?: number; // for internal use in flat data generation
}

export interface INewTableRow extends INewTableRowTemplate<ILocalNewTableRowDataCommon> { }
