export interface INewMenuItem {
  label: string;
  icon?: string;
  actionName?: string;
  payload?: unknown;
  children?: INewMenuItem[];
};

export interface INewContextMenuXY {
  x: number;
  y: number;
}
