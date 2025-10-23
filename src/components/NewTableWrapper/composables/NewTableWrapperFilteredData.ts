import { computed, Ref, ref, toValue, watch } from "vue";

import type { INewTableRow } from "../../NewTable/types/NewTableRowTypes";
import type { INewTableFilter, INewTableFilters } from "../../NewTable/types/NewTableFilterTypes";

import { generateFilteredDataForNested } from "../../../helpers/generateFilteredDataForNested";

export function useNewTableWrapperFilteredData(
  data: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
  initialFilters: Ref<INewTableFilters> | INewTableFilters | (() => INewTableFilters) | undefined,
) {
  const localData = ref<INewTableRow[]>(toValue(data || []));

  const filters = ref<Record<string, INewTableFilter>>(toValue(initialFilters) || {})

  const computedFilteredData = computed(
    () => generateFilteredData(localData.value, filters.value),
  );

  watch(
    () => toValue(data),
    () => {
      localData.value = toValue(data);
    }
  );

  watch(
    () => toValue(initialFilters),
    () => {
      const initialFiltersValue = toValue(initialFilters)
      filters.value = Object.keys(initialFiltersValue || {}).reduce(
        (acc: INewTableFilters, filterName: string) => {
          acc[filterName] = {
            ...(initialFiltersValue?.[filterName] || {}),
            currentValue: filters.value?.[filterName]?.currentValue ?? initialFiltersValue?.[filterName].currentValue
          }

          return acc;
        },
        {},
      );
    }
  );

  function clearFilters() {
    filters.value = {};
  }

  function reset() {
    filters.value = toValue(initialFilters || {});
  }

  function resetFiltersToDefaultValues() {
    const currentFilters: Record<string, INewTableFilter> = filters.value;

    if (!Object.keys(currentFilters)) {
      return localData;
    }
    Object.keys(currentFilters).forEach(
      (filterName: string) => {
        currentFilters[filterName] = {
          ...currentFilters[filterName],
          currentValue: currentFilters[filterName].defaultValue,
        }
      }
    );
  }

  function resetFiltersToInitialValues() {
    const currentFilters: Record<string, INewTableFilter> = filters.value;

    if (!Object.keys(currentFilters)) {
      return localData;
    }
    Object.keys(currentFilters).forEach(
      (filterName: string) => {
        currentFilters[filterName] = {
          ...currentFilters[filterName],
          currentValue: currentFilters[filterName].initialValue,
        }
      }
    );
  }

  function generateFilteredData(
    currentData: INewTableRow[],
    currentFilters: Record<string, INewTableFilter>
  ): INewTableRow[] {
    if (!Object.keys(currentFilters)) {
      return currentData;
    }

    let resultData = currentData;

    Object.keys(currentFilters).forEach(
      (filterName: string) => {
        resultData = generateFilteredDataForNested(
          currentFilters[filterName],
          filterName,
          resultData,
        );
      }
    );

    return resultData;
  }

  return {
    filters,
    computedFilteredData,
    clearFilters,
    reset,
    resetFiltersToDefaultValues,
    resetFiltersToInitialValues,
    generateFilteredData,
  };
};