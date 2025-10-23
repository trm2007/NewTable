import type { INewTableFilter } from "../components/NewTable/types/NewTableFilterTypes";
import type { INewTableRow } from "../components/NewTable/types/NewTableRowTypes";

import { compareFilterAsString } from "../helpers/compareFilterAsString";

export const filters: Record<string, INewTableFilter> = {
  name: {
    // для моделей фильтров и текщих значений вводимых пользователем
    currentValue: null,
    // последнее примененное значение фильтра для отображаемых данных
    initialValue: null,
    // значения фильтра по умлочанию
    defaultValue: null,
    // доступные значения, может быть списком доступных значений, диапазоном, максимальныс значением или др.
    availableValue: null,
    // функция для проверки - соответствует ли значение в строке row в ячейке cellName значению фильтра filterValue
    compare: (
      filterValue: string,
      cellName: string,
      row: INewTableRow,
      // data: INewTableRow[], // как пример, может передаваться перелаваться в другие функции сравнения
    ) => compareFilterAsString(filterValue, row.data[cellName] as string),
  }
}