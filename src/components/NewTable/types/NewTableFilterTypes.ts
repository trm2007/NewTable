import type { INewTableColumnComponent } from "../components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableRow } from "../components/NewTableRow/types/NewTableRowTypes";

export interface INewTableFilter {
  // для моделей фильтров и текщих значений вводимых пользователем
  currentValue: unknown;
  // последнее примененное значение фильтра для отображаемых данных
  initialValue?: unknown;
  // значения фильтра по умлочанию
  defaultValue?: unknown;
  // доступные значения, может быть списком доступных значений, диапазоном, максимальныс значением или др.
  availableValue?: unknown;
  // функция для проверки - соответствует ли значение в строке row в ячейке cellName значению фильтра filterValue
  compare?: (filterValue: unknown, cellName: string, row: INewTableRow, data?: INewTableRow[]) => boolean;
  component?: INewTableColumnComponent;
}

export type INewTableFilters = Record<string, INewTableFilter>

export type INewTableSorts = Record<string, -1 | 0 | 1>