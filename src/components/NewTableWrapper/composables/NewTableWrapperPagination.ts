import { computed, ref, Ref, toValue, watch } from "vue";

import type { INewTableRow } from '../../NewTable/types/NewTableRowTypes';

const NEW_TABLE_STEP = 3;

export function useNewTablePagination(
  computedFlatData: INewTableRow[] | Ref<INewTableRow[]> | (() => INewTableRow[]),
  computedOnlyExpandedFlatData: INewTableRow[] | Ref<INewTableRow[]> | (() => INewTableRow[]),
) {
  const startIndex = ref(0);

  const rowCount = ref(10);

  const computedOnlyExpandedFlatDataLength = computed<number>(
    () => toValue(computedOnlyExpandedFlatData).length
  );

  const computedFlatDataToVew = computed(
    () => {
      return toValue(computedFlatData)
        .slice(toValue(startIndex), toValue(startIndex) + toValue(rowCount));
    }
  );

  const computedOnlyExpandedFlatDataToView = computed(
    () => {
      return toValue(computedOnlyExpandedFlatData)
        .slice(toValue(startIndex), toValue(startIndex) + toValue(rowCount));
    }
  );

  watch(
    () => computedOnlyExpandedFlatDataLength.value,
    () => {
      correctStartValue();
    },
  );

  function setRowCount(newRowCount: number) {
    rowCount.value = newRowCount;
  }

  function onPrevious() {
    startIndex.value = Math.max(0, startIndex.value - NEW_TABLE_STEP);
  }

  function onNext() {
    if (computedOnlyExpandedFlatDataLength.value <= rowCount.value) {
      startIndex.value = 0;
      return;
    }

    startIndex.value = Math.min(
      computedOnlyExpandedFlatDataLength.value - rowCount.value,
      startIndex.value + NEW_TABLE_STEP,
    );
  }

  function correctStartValue() {
    startIndex.value = Math.min(
      computedOnlyExpandedFlatDataLength.value - rowCount.value,
      startIndex.value,
    );

    startIndex.value = Math.max(0, startIndex.value);
  }

  return {
    startIndex,
    rowCount,
    computedFlatDataToVew,
    computedOnlyExpandedFlatDataToView,
    setRowCount,
    onPrevious,
    onNext,
    correctStartValue,
  }
}