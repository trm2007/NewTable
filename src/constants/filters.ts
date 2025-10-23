import { ROW_MODES } from "../components/NewTable/constants/rowModes";
import type { INewTableFilter } from "../components/NewTable/types/NewTableFilterTypes";
import type { INewTableRow } from "../components/NewTable/types/NewTableRowTypes";

import { compareFilterAsString } from "../helpers/compareFilterAsString";
import { statusOptions } from "./columns";

export const filters: Record<string, INewTableFilter> = {
  name: {
    // для моделей фильтров и текщих значений вводимых пользователем
    currentValue: '',
    // последнее примененное значение фильтра для отображаемых данных
    initialValue: '',
    // значения фильтра по умлочанию
    defaultValue: '',
    // доступные значения, может быть списком доступных значений, диапазоном, максимальныс значением или др.
    availableValue: null,
    // функция для проверки - соответствует ли значение в строке row в ячейке cellName значению фильтра filterValue
    compare: (
      filterValue: string,
      cellName: string,
      row: INewTableRow,
      // data: INewTableRow[], // как пример, может передаваться перелаваться в другие функции сравнения
    ) => compareFilterAsString(filterValue, row.data[cellName] as string),
    component: {
      name: 'TextComponent',
      changeEventName: 'input',
      props: {
        mode: ROW_MODES.EDIT,
      },
    },
  },
  status: {
    currentValue: null,
    defaultValue: null,
    compare: (
      filterValue: string,
      cellName: string,
      row: INewTableRow,
      // data: INewTableRow[], // как пример, может передаваться перелаваться в другие функции сравнения
    ) => filterValue === row.data[cellName],
    component: {
      name: 'SimpleSelectComponent',
      props: {
        options: statusOptions,
        mode: ROW_MODES.EDIT,
      },
      changeEventName: 'update:value',
    },
  },
}