<script setup lang="ts">
import { useTestPage1NewReestrInitData } from './composables/TestPage1NewReestrInitData';

import NewReestr from '../../components/NewReestr/NewReestr.vue';

const {
  actions,
  actionsChangeModes,
  columns,
  columnsSettings,
  data,
  contextMenuItems,
  filters,
  sorts,
  initData,
} = useTestPage1NewReestrInitData();
</script>

<template>
  <div class="test-page1">
    <div class="test-page1__actions">
      <button @click="initData">
        Init Data
      </button>
    </div>

    <NewReestr
      :initial-data="data"
      :initial-columns="columns"
      :initial-columns-settings="columnsSettings"
      :initial-filters="filters"
      :initial-sorts="sorts"
      :initial-actions-change-modes="actionsChangeModes"
      :initial-actions="actions"
      :initial-context-menu-items="contextMenuItems"
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

.test-page1__actions {
  border-radius: 8px;
  background-color: #eee;
  width: 100%;
  text-align: center;
  padding: 8px;
}

:deep() .--stage {
  background-color: #dfefff;
}

:deep() .--sub-stage {
  background-color: #f5faff;
}

:deep() .--task {
  background-color: #ffffff;
}

/* так можно переопределять стили */
:deep(.new-table .new-table__header__cell .new-table__header__cell__filter__icon.--active) {
  color: red;
}
</style>