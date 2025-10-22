import { Ref, toValue } from "vue";

import type { INewTableHeaderSetting } from "../types/NewTableHeaderTypes";
import type { INewTableChangeColumnWidthEvent } from "../../../types/NewTableEventTypes";

type TNewTableHeaderMouseWidthEmit = (e: 'change:column-width', event: INewTableChangeColumnWidthEvent) => void;

export function useNewTableHeaderMouseWidth(
  localColumnsSettings: Ref<Record<string, INewTableHeaderSetting>> | Record<string, INewTableHeaderSetting> | (() => Record<string, INewTableHeaderSetting>),
  emit: TNewTableHeaderMouseWidthEmit,
) {
  function onMouseDown(columnName: string, event: MouseEvent) {
    if (
      event.button !== 0
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const onMouseMoveLocal = (mouseEvent: MouseEvent) => onMouseMove(columnName, mouseEvent);
    const onMouseUpLocal = (mouseEvent: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      document.removeEventListener('mousemove', onMouseMoveLocal);
      document.removeEventListener('mouseup', onMouseUpLocal);
      // document.removeEventListener('mouseleave', onMouseUpLocal);
    }

    document.addEventListener('mousemove', onMouseMoveLocal);
    document.addEventListener('mouseup', onMouseUpLocal);
    // document.addEventListener('mouseleave', onMouseUpLocal);
  }

  function onMouseMove(columnName: string, event: MouseEvent) {
    console.log('[onMouseMove]', columnName, event);

    event.preventDefault();
    event.stopPropagation();

    let currentWidth = toValue(localColumnsSettings)[columnName].width;

    if (!currentWidth) {
      currentWidth = (event.target as HTMLElement)?.getBoundingClientRect().width
    }
    console.log('[onMouseMove]', columnName, currentWidth);

    emit('change:column-width', { columnName, delta: event.movementX, currentWidth });
  }

  return {
    onMouseDown,
    onMouseMove,
  }
}