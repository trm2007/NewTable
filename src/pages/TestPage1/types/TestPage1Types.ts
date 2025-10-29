import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";

export interface INewTableChangeCellDataEvent {
  row: INewTableRow, // row
  key: string, // cell name
  value: unknown, // event data from cell component        
};
