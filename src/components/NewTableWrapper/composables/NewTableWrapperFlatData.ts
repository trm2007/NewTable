import { computed, Ref, toValue } from "vue";

import type { INewTableRow } from "../../NewTable/types/NewTableRowTypes";

export function useNewTableWrapperFlatData(
  data: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  expandedRows: Ref<Set<number | string>> | Set<number | string> | (() => Set<number | string>)
) {
  const computedFlatData = computed(
    () => generateFlatData(toValue(data)),
  );

  const computedOnlyExpandedFlatData = computed(
    () => generateOnlyExpandedFlatData(toValue(data), toValue(expandedRows)),
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