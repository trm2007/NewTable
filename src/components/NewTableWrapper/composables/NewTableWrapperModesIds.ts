import { computed, ref } from "vue";
import { ROW_MODES } from "../../NewTable/constants/rowModes";

export function useNewTableWrapperModesIds() {
  const modeIds = ref<Record<string, Set<number | string>>>({});

  const editingIds = computed<Set<number | string> | undefined>(
    () => modeIds.value[ROW_MODES.EDIT]
  );
  const expandedIds = computed<Set<number | string> | undefined>(
    () => modeIds.value[ROW_MODES.EXPANDED]
  );
  const checkedIds = computed<Set<number | string> | undefined>(
    () => modeIds.value[ROW_MODES.CHECKED]
  );

  function switchOnModeForRow(mode: string, id: number | string) {
    if (!modeIds.value[mode]) {
      modeIds.value[mode] = new Set();
    }
    modeIds.value[mode].add(id);
  }

  function switchOffModeForRow(mode: string, id: number | string) {
    if (modeIds.value[mode]?.has(id)) {
      modeIds.value[mode].delete(id);
    }
  }

  function toggleModeForRow(mode: string, id: number | string) {
    if (modeIds.value?.[mode]?.has(id)) {
      switchOffModeForRow(mode, id);
    } else {
      switchOnModeForRow(mode, id);
    }
  }

  function addEditingId(id: number | string) {
    switchOnModeForRow(ROW_MODES.EDIT, id);
  }

  function deleteEditingId(id: number | string) {
    switchOffModeForRow(ROW_MODES.EDIT, id);
  }

  return {
    modeIds,
    editingIds,
    expandedIds,
    checkedIds,
    addEditingId,
    deleteEditingId,
    switchOnModeForRow,
    switchOffModeForRow,
    toggleModeForRow,
  };
}