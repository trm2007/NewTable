import { INewTableHeaderSetting } from "../NewTable/components/NewTableHeader/types/NewTableHeaderTypes";

export interface IChangeColumnSettingsEvent {
  columnName: string;
  columnsSettings: INewTableHeaderSetting;
}
