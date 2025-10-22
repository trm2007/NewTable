import { computed, ref, Ref, toValue, watchEffect } from "vue";
import { INewTableRow } from "../../../constants/testData";

const NEW_TABLE_STEP = 3;

export function useNewTablePagination(
  computedFlatData: INewTableRow[] | Ref<INewTableRow[]> | (() => INewTableRow[]),
  computedOnlyExpandedFlatData: INewTableRow[] | Ref<INewTableRow[]> | (() => INewTableRow[]),
) {
  const startIndex = ref(0);

  const rowCount = ref(10);

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

  function setRowCount(newRowCount: number) {
    rowCount.value = newRowCount;
  }

  function onPrevious() {
    startIndex.value = Math.max(0, startIndex.value - NEW_TABLE_STEP);
  }

  function onNext() {
    startIndex.value = Math.min(
      toValue(computedOnlyExpandedFlatData).length - rowCount.value,
      startIndex.value + NEW_TABLE_STEP
    );
  }

  return {
    startIndex,
    rowCount,
    computedFlatDataToVew,
    computedOnlyExpandedFlatDataToView,
    setRowCount,
    onPrevious,
    onNext,
  }
}