import { computed, Ref, ref, toValue, watchEffect } from "vue";

import type { INewTableColumn } from "../../NewTable/types/INewTableHeadTypes";
import type { INewTableHeaderSetting } from "../../NewTable/components/NewTableHeader/types/NewTableHeaderTypes";

const NEW_TABLE_HEAD_MIN_WIDTH: number = 20;
const NEW_TABLE_HEAD_MAX_WIDTH: number = 500;

export function useNewTableWrapperHeader(
  columns: Ref<INewTableColumn[]> | INewTableColumn[] | (() => INewTableColumn[]),
  columnsSettings: Ref<Record<string, INewTableHeaderSetting>> | Record<string, INewTableHeaderSetting> | (() => Record<string, INewTableHeaderSetting>),
) {
  const localColumnsSettings = ref<Record<string, INewTableHeaderSetting>>(
    JSON.parse(JSON.stringify(toValue(columnsSettings))),
  );
  // const localColumns = ref<INewTableColumn[]>(toValue(columns));

  watchEffect(() => {
    localColumnsSettings.value = JSON.parse(JSON.stringify(toValue(columnsSettings)));
    // localColumns.value = toValue(columns);
  });

  const computedColumns = computed<Record<string, INewTableColumn>>(
    () => {
      return toValue(columns).reduce((acc, col) => {
        acc[col.key] = col;
        return acc;
      }, {} as Record<string, INewTableColumn>);
    }
  );

  const computedColumnsSortByOrder = computed<INewTableColumn[]>(
    () => {
      return Object.keys(localColumnsSettings.value)
        .sort((keyA, keyB) => {
          return localColumnsSettings.value[keyA].order - localColumnsSettings.value[keyB].order;
        })
        .map(
          (key) => computedColumns.value[key]
        );
    }
  );

  const computedColumnsSortByOrderVisible = computed<INewTableColumn[]>(
    () => {
      return computedColumnsSortByOrder.value.filter(
        (col) => localColumnsSettings.value[col.key]?.visible !== false
      );
    }
  );

  function changeColumnOrders(columnFrom: string, columnTo: string) {
    if (
      !columnFrom
      || !columnTo
      || columnFrom === columnTo
    ) {
      return;
    }

    const fromOrder = localColumnsSettings.value?.[columnFrom].order;
    const toOrder = localColumnsSettings.value?.[columnTo].order;

    // слева-направо
    if (toOrder > fromOrder) {
      Object.keys(localColumnsSettings.value || {}).forEach(
        (columnName: string) => {
          if (!localColumnsSettings.value?.[columnName]) {
            return;
          }
          if (
            localColumnsSettings.value[columnName].order > fromOrder
            && localColumnsSettings.value[columnName].order <= toOrder
          ) {
            localColumnsSettings.value[columnName].order--;
          }
        }
      );
    }
    // справа-налево
    else {
      Object.keys(localColumnsSettings.value || {}).forEach(
        (columnName: string) => {
          if (!localColumnsSettings.value?.[columnName]) {
            return;
          }
          if (
            localColumnsSettings.value[columnName].order < fromOrder
            && localColumnsSettings.value[columnName].order >= toOrder
          ) {
            localColumnsSettings.value[columnName].order++;
          }
        }
      );
    }

    localColumnsSettings.value[columnFrom].order = toOrder;
    // localColumnsSettings.value = {
    //   ...localColumnsSettings.value,
    //   [columnFrom]: {
    //     ...localColumnsSettings.value[columnFrom],
    //     order: toOrder
    //   },
    // };
  }

  function changeColumnWidths(columnName: string, delta: number, currentWidth: number) {
    const newWidth = currentWidth + delta;
    if (
      newWidth < NEW_TABLE_HEAD_MIN_WIDTH
      || newWidth > NEW_TABLE_HEAD_MAX_WIDTH
    ) {
      return;
    }
    localColumnsSettings.value = {
      ...localColumnsSettings.value,
      [columnName]: {
        ...localColumnsSettings.value[columnName],
        width: currentWidth + delta,
      },
    };
  }


  return {
    localColumnsSettings,
    computedColumnsSortByOrder,
    computedColumnsSortByOrderVisible,
    changeColumnOrders,
    changeColumnWidths,
  };
};