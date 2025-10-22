import type { INewTableRow } from "./NewTableRowTypes";

export interface INewTableRowActionEvent {
  name: string; // action name
  row: INewTableRow; // row
  value?: unknown | null; // event data from action component
}

export interface INewTableCellActionEvent {
  key: string; // cell name
  row: INewTableRow; // row
  name?: string; // action name
  value?: unknown | null; // event data from cell component
}

export interface INewTableChangeColumnsOrderEvent {
  columnFrom: string | undefined;
  columnTo: string | null
}

export interface INewTableUpdateCellDataEvent {
  key: string; // cell name
  value: unknown | null; // event data from cell component
  row: INewTableRow; // row
}

export interface INewTableChangeColumnWidthEvent {
  columnName: string;
  delta: number;
  currentWidth: number;
}

export interface INewTableChangeFilterSearch {
  key: string;
  searchStr: string;
}