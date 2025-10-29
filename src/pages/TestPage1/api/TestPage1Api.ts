import type { INewTableColumn, INewTableHeaderSettings } from "../../../components/NewTable/components/NewTableHeader/types/INewTableHeadTypes";
import type { INewTableRow } from "../../../components/NewTable/components/NewTableRow/types/NewTableRowTypes";
import type { INewTableActions } from "../../../components/NewTable/types/NewTableActionTypes";
import type { TNewTableActionsChangeModesStandart } from "../../../components/NewTable/types/NewTableActionsChangeModesTypes";
import type { INewReestrContexMenuItems } from "../../../components/NewReestr/types/newReestrContexMenuItems";
import type { INewTableFilters, INewTableSorts } from "../../../components/NewTable/types/NewTableFilterTypes";

import { generateExtraColumns, testColumns } from "../testdata/columns";
import { generateLargeTestData } from "../testdata/testData";
import { newTableStandartActions } from "../../../components/NewTableWrapper/constants/standartActions";
import { generateExtraColumnsSettings, testColumnsSettings } from "../testdata/testColumnsSettings";
import { testActionsChangeModes } from "../testdata/actionsChangeModes";
import { testContextMenuItems } from "../testdata/contextMenuItems";
import { testFilters } from "../testdata/filters";
import { testSorts } from "../testdata/sirts";

export function fetchActions(): Promise<INewTableActions> {
  return new Promise((resolve) => {
    resolve(newTableStandartActions);
  });
}

export function fetchActionsChangeModes(): Promise<TNewTableActionsChangeModesStandart> {
  return new Promise((resolve) => {
    resolve(testActionsChangeModes);
  });
}

export function fetchColumns(
  payload: { extraFieldCount: number },
): Promise<INewTableColumn[]> {
  return new Promise((resolve) => {
    const { extraFieldCount } = payload;

    const data = generateExtraColumns(
      testColumns,
      extraFieldCount
    );

    resolve(data);
  });
}

export function fetchColumnsSettings(
  payload: { extraFieldCount: number },
): Promise<INewTableHeaderSettings> {
  return new Promise((resolve) => {
    const { extraFieldCount } = payload;

    const data = generateExtraColumnsSettings(
      testColumnsSettings,
      extraFieldCount,
    );

    resolve(data);
  });
}

export function fetchData(
  payload: { count: number, maxLevel: number, extraFieldCount: number },
): Promise<INewTableRow[]> {
  return new Promise((resolve) => {
    const { count, maxLevel, extraFieldCount } = payload;

    const data = generateLargeTestData(count, maxLevel, extraFieldCount);
    resolve(data);
  });
}

export function fetchContextMenuItems(): Promise<INewReestrContexMenuItems> {
  return new Promise((resolve) => {
    resolve(testContextMenuItems);
  });
}

export function fetchFilters(): Promise<INewTableFilters> {
  return new Promise((resolve) => {
    resolve(testFilters);
  });
}

export function fetchSorts(): Promise<INewTableSorts> {
  return new Promise((resolve) => {
    resolve(testSorts);
  });
}