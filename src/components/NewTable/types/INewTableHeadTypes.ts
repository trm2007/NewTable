export interface INewTableColumnMeta {
  width?: number;
  [key: string]: any;
}

export interface INewTableColumnComponent {
  name: string;
  props: Record<string, any>;
}

export interface INewTableColumnComponents extends Record<string, INewTableColumnComponent | undefined> {
  default?: INewTableColumnComponent
}

export interface INewTableColumn {
  name: string;
  key: string;
  meta?: INewTableColumnMeta;
  components: INewTableColumnComponents;
}
