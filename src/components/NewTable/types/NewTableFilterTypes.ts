import type { INewTableRow } from "./NewTableRowTypes";

export interface INewTableFilter {
  // для моделей фильтров и текщих значений вводимых пользователем
  currentValue: any;
  // последнее примененное значение фильтра для отображаемых данных
  initialValue?: any;
  // значения фильтра по умлочанию
  defaultValue?: any;
  // доступные значения, может быть списком доступных значений, диапазоном, максимальныс значением или др.
  availableValue?: any;
  // функция для проверки - соответствует ли значение в строке row в ячейке cellName значению фильтра filterValue
  compare?: (filterValue: any, cellName: string, row: INewTableRow, data: INewTableRow[]) => boolean;
}

export type INewTableFilters = Record<string, INewTableFilter>