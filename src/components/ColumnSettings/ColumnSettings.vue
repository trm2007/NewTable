<script setup lang="ts">
import { computed } from 'vue';

import type { INewTableColumn } from '../NewTable/types/INewTableHeadTypes';
import type { INewTableHeaderSetting } from '../NewTable/components/NewTableHeader/types/NewTableHeaderTypes';
import type { IChangeColumnSettingsEvent } from './types';

import { columns } from '../../constants/columns';

type TListOfColumnSettings = Record<string, Partial<INewTableHeaderSetting & INewTableColumn>>

const props = defineProps<{
  columns: INewTableColumn[];
  columnsSettings: Record<string, INewTableHeaderSetting>;
}>();

const emit = defineEmits<{
  (e: 'change:column-settings', event: IChangeColumnSettingsEvent): void
}>()

const omputedListOfColumnSettings = computed<TListOfColumnSettings>(
  (): TListOfColumnSettings => {
    return Object.keys(props.columnsSettings || {}).reduce(
      (
        acc: TListOfColumnSettings,
        currentColumnSetttingName: string,
      ): TListOfColumnSettings => {
        const currentColumn = columns.find(
          (column) => column.key === currentColumnSetttingName
        );

        if (!currentColumn) {
          acc[currentColumnSetttingName] = props.columnsSettings[currentColumnSetttingName];
        } else {
          acc[currentColumnSetttingName] = {
            ...props.columnsSettings[currentColumnSetttingName],
            key: currentColumn.key,
            name: currentColumn.name,
          };
        }

        return acc;
      },
      {}
    );
  }
);

function onChangeVisible(columnName: string, event: Event) {
  const value = (event.target as HTMLInputElement).checked;
  emit('change:column-settings', {
    columnName,
    columnsSettings: {
      ...props.columnsSettings[columnName],
      visible: value,
    }
  });
}
</script>

<template>
  <div>
    <div
      v-for="(columnSetting, columnName) in omputedListOfColumnSettings"
      :key="columnName"
    >
      <label>
        <input
          :checked="columnSetting.visible"
          type="checkbox"
          @change="onChangeVisible(columnName, $event)"
        >
        {{ columnName }}
      </label>
    </div>
  </div>
</template>