export interface INewContexMenuItem {
  label: string;
  icon?: string;
  actionName?: string;
  payload?: unknown;
  children?: INewContexMenuItem[];
};

export interface INewContextMenuXY {
  x: number;
  y: number;
}
