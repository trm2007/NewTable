import type { INewTableRow } from "./NewTableRowTypes";

export interface INewTableRowActionEvent {
  name: string; // action name
  row: INewTableRow; // row
  value?: INewTableCellActionData | unknown; // event data from action component
}

export interface INewTableCellActionData {
  key: string; // cell name
  name?: string; // action name
  value?: unknown; // event data from cell component
}

export interface INewTableChangeColumnsOrderEvent {
  columnFrom: string | undefined;
  columnTo: string | null
}

export interface INewTableChangeColumnWidthEvent {
  columnName: string;
  delta: number;
  currentWidth: number;
}

export interface INewTableChangeFilterValue {
  key: string;
  value: string;
}