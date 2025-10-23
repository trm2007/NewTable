<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { INewTableChangeFilterValue } from '../../../types/NewTableEventTypes';
import { INewTableFilters } from '../../../types/NewTableFilterTypes';

const props = defineProps<{
  activeHeaderFilterName: string;
  filters?: INewTableFilters;
  computedFilterTeleportNames: Record<string, string>,
}>();

const emit = defineEmits<{
  (e: 'change:filter-value', event: INewTableChangeFilterValue): void;
  (e: 'close', event: string): void;
}>();

const el = ref<HTMLElement>();

onMounted(() => {
  // el?.value.addEventListener('click', clickHandler, true);
  window.addEventListener('click', clickHandler, true);
});

onBeforeUnmount(() => {
  // el?.value.removeEventListener('click', clickHandler, true);
  window.removeEventListener('click', clickHandler, true);
});

function clickHandler(event: MouseEvent) {
  // event.stopPropagation();
  // event.preventDefault();

  if (
    event.type === 'click'
    && !el?.value.contains(event.target as HTMLElement)
  ) {
    emit('close', props.activeHeaderFilterName)
  }
}
</script>

<template>
  <teleport
    v-if="!!activeHeaderFilterName && activeHeaderFilterName in (filters || {})"
    :to="`#${computedFilterTeleportNames[activeHeaderFilterName]}`"
  >
    <div
      ref="el"
      class="new-table__header__filter"
    >
      <component
        :is="props.filters[activeHeaderFilterName]?.component.name || 'input'"
        :value="props.filters[activeHeaderFilterName]?.currentValue"
        :filter="props.filters[activeHeaderFilterName]"
        v-bind="props.filters[activeHeaderFilterName]?.component.props || {}"
        v-on="{
          [props.filters[activeHeaderFilterName]?.component.changeEventName || 'change']:
            ($event) => emit('change:filter-value', { key: activeHeaderFilterName, value: $event })
        }"
      />
    </div>
  </teleport>
</template>