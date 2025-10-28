import { Ref, ref, toValue } from "vue";

import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableColumn, INewTableHeaderSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableActions } from "../../../components/NewTable/types/NewTableActionTypes";
import type { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";
import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrContexMenuItems";
import type { INewTableFilters, INewTableSorts } from "../../../components/NewTable/types/NewTableFilterTypes";

import { NEW_TABLE_STANDART_ROW_ACTIONS, newTableStandartActions } from "../../../components/NewTableWrapper/constants/standartActions";
import { NEW_TABLE_DEFAULT_MODE } from "../../../components/NewTable/constants/rowModes";
import { newTableStandartActionsChangeModes } from "../../../components/NewTableWrapper/constants/standartActionsChangeModes";
import { testActionsChangeModes } from "../../../constants/actionsChangeModes";
import { generateExtraColumns, testColumns } from "../../../constants/columns";
import { generateExtraColumnsSettings, testColumnsSettings } from "../../../constants/testColumnsSettings";
import { generateLargeTestData } from "../../../constants/testData";
import { testContextMenuItems } from "../../../constants/contextMenuItems";
import { testFilters } from "../../../constants/filters";
import { testSorts } from "../../../constants/sirts";

export function useTestPage1NewReestrInitData(
  count: (number | Ref<number> | (() => number)) = 10000,
  maxLevel: (number | Ref<number> | (() => number)) = 5,
  extraFieldCount: (number | Ref<number> | (() => number)) = 7,
) {
  const data = ref<INewTableRow[]>([]);

  const columns = ref<INewTableColumn[]>([]);

  const columnsSettings = ref<INewTableHeaderSettings>({});

  const actions = ref<INewTableActions>(newTableStandartActions)

  const actionsChangeModes = ref<TNewTableActionsChangeModesStandart>(
    {
      ...newTableStandartActionsChangeModes,
      ...testActionsChangeModes,
    }
  );

  const contextMenuItems = ref<INewReestrContexMenuItems>(testContextMenuItems);

  const filters = ref<INewTableFilters>(testFilters);

  const sorts = ref<INewTableSorts>(testSorts);

  function initData() {
    columns.value = generateExtraColumns(
      testColumns,
      toValue(extraFieldCount)
    );

    columnsSettings.value = generateExtraColumnsSettings(
      testColumnsSettings,
      toValue(extraFieldCount)
    );

    actionsChangeModes.value = {
      ...actionsChangeModes.value,
      [NEW_TABLE_DEFAULT_MODE]: {
        ...(actionsChangeModes.value[NEW_TABLE_DEFAULT_MODE] || {}),
        [NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]: {
          on: [...(actionsChangeModes.value[NEW_TABLE_DEFAULT_MODE]?.[NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]?.on || []), 'changed'],
          off: actionsChangeModes.value[NEW_TABLE_DEFAULT_MODE]?.[NEW_TABLE_STANDART_ROW_ACTIONS.SAVE]?.off || [],
        }
      },
    }

    data.value = generateLargeTestData(
      toValue(count),
      toValue(maxLevel),
      toValue(extraFieldCount),
    );
  }

  return {
    actions,
    actionsChangeModes,
    columns,
    columnsSettings,
    data,
    contextMenuItems,
    filters,
    sorts,
    initData,
  }
}
