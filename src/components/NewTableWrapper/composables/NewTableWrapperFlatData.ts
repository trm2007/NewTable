import { computed, Ref, toValue } from "vue";

import type { INewTableRow } from "../../NewTable/components/NewTableRow/types/NewTableRowTypes";

import { NEW_TABLE_STANDART_ROW_MODES } from "../../NewTable/constants/rowModes";

export function useNewTableWrapperFlatData(
  data: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  modeIds: Ref<Record<string, Set<number | string>>> | Record<string, Set<number | string>> | (() => Record<string, Set<number | string>>)
) {
  const computedFlatData = computed<INewTableRow[]>(
    () => generateFlatData(toValue(data)),
  );

  const computedOnlyExpandedFlatData = computed<INewTableRow[]>(
    () => generateOnlyExpandedFlatData(toValue(data), toValue(modeIds)[NEW_TABLE_STANDART_ROW_MODES.EXPANDED]),
  );

  function generateFlatData(
    dataForTransform: INewTableRow[],
    level: number = 0
  ): INewTableRow[] {
    const flatData: INewTableRow[] = [];

    dataForTransform.forEach((row) => {
      row.__level = level;
      flatData.push(row);
      if (row.children && row.children.length > 0) {
        const childFlatData = generateFlatData(row.children, level + 1);
        flatData.push(...childFlatData);
      }
    });

    return flatData;
  }

  function generateOnlyExpandedFlatData(
    dataForTransform: INewTableRow[],
    expandedRowsForTransform: Set<number | string>,
    level: number = 0
  ): INewTableRow[] {
    const flatData: INewTableRow[] = [];

    dataForTransform.forEach((row) => {
      row.__level = level;
      flatData.push(row);
      if (
        row.children
        && row.children.length > 0
        && expandedRowsForTransform?.has(row.data.id)
      ) {
        const childFlatData = generateOnlyExpandedFlatData(row.children, expandedRowsForTransform, level + 1);
        flatData.push(...childFlatData);
      }
    });

    return flatData;
  }

  return {
    computedFlatData,
    computedOnlyExpandedFlatData,
  };
};