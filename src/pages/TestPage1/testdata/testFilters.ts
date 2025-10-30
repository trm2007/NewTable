import type { INewTableFilter, INewTableFilters } from "../../../components/NewTable/types/NewTableFilterTypes";
import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../../components/NewTable/constants/standartRowModes";
import { compareFilterAsString } from "../../../helpers/compareFilterAsString";
import { statusOptions } from "./testColumns";

function generateEmptyTextFilter(): INewTableFilter {
  return {
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
        mode: NEW_TABLE_STANDART_ROW_MODES.EDIT,
      },
    },
  }
}

export const testFilters: INewTableFilters = {
  id: {
    ...generateEmptyTextFilter(),
  },
  name: {
    ...generateEmptyTextFilter(),
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
        mode: NEW_TABLE_STANDART_ROW_MODES.EDIT,
      },
      changeEventName: 'update:value',
    },
  },
}