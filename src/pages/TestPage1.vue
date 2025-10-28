<script setup lang="ts">
import NewReestr from '../components/NewReestr/NewReestr.vue';

const data = ref<INewTableRow[]>([]);
const columns = ref<INewTableColumn[]>([]);
const columnsSettings = ref<Record<string, INewTableHeaderSetting>>({});

const actions = ref<INewTableActions>(newTableStandartActions)

const actionsChangeModes = ref<TNewTableActionsChangeModesStandart>(
  {
    ...newTableStandartActionsChangeModes,
    ...testActionsChangeModes,
  }
);


function initData() {
  const extraFieldCount = 20;

  columns.value = generateExtraColumns(testColumns, extraFieldCount);

  columnsSettings.value = generateExtraColumnsSettings(testColumnsSettings, extraFieldCount);

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

  data.value = generateLargeTestData(20, 5, extraFieldCount);

  timeStamp.value = Date.now();
}

</script>

<template>
  <div class="test-page1">
    <NewReestr
      :data="data"
      :columns="columns"
      :columns-settings="columnsSettings"
      :initial-filters="filters"
      :initial-sorts="sorts"
      :actions-change-modes="actionsChangeModes"
      :actions="actions"
      :isNumberColumnShown="true"
      :isCheckboxColumnShown="true"
      :isExpandColumnShown="true"
      :common-meta="{
        class: {
          stage: '--stage',
          subStage: '--sub-stage',
          task: '--task',
        }
      }"
    />
  </div>
</template>

<style scoped>
.test-page1 {
  width: 100%;
}
</style>