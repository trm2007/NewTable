import { computed, Ref, ref, toValue, watchEffect } from "vue";

import type { INewTableRow } from "../../NewTable/types/NewTableRowTypes";

export function useNewTableWrapperFlatData(
  data: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  expandedRows: Ref<Set<number | string>> | Set<number | string> | (() => Set<number | string>)
) {

  const localData = ref<INewTableRow[]>(toValue(data));

  watchEffect(() => {
    localData.value = toValue(data);
  });

  const computedFlatData = computed(
    () => generateFlatData(localData.value),
  );

  const computedOnlyExpandedFlatData = computed(
    () => generateOnlyExpandedFlatData(localData.value),
  );

  function generateFlatData(
    data: INewTableRow[],
    level: number = 0
  ): INewTableRow[] {
    const flatData: INewTableRow[] = [];

    data.forEach((row) => {
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
    data: INewTableRow[],
    level: number = 0
  ): INewTableRow[] {
    const flatData: INewTableRow[] = [];

    data.forEach((row) => {
      row.__level = level;
      flatData.push(row);
      if (
        row.children
        && row.children.length > 0
        && toValue(expandedRows)?.has(row.data.id)
      ) {
        const childFlatData = generateOnlyExpandedFlatData(row.children, level + 1);
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