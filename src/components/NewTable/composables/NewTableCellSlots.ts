import { computed, onMounted, ref, useSlots } from "vue";

export function useNewTableCellSlots() {
  const slots = useSlots();

  const computedHeadSlots = computed<string[]>(
    () => Object.keys(slots || {}).filter(
      (slotName: string) => /head\[.+\]/.test(slotName),
    )
  );

  const computedCellSlots = computed<string[]>(
    () => Object.keys(slots || {}).filter(
      (slotName: string) => /cell\[.+\]/.test(slotName),
    )
  );

  return {
    slots,
    computedHeadSlots,
    computedCellSlots,
  }
}