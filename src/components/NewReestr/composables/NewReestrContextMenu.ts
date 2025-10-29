import type { INewContexMenuItem } from "../../NewContextMenu/types";
import type { INewTableCellNativeEvent } from "../../NewTable/types/NewTableEventTypes";

export function useNewReestrContextMenu(
  // activeContextMenuItems: Ref<INewContexMenuItem[]> | INewContexMenuItem[] | (() => INewContexMenuItem[]),
) {
  function generateContextMenuItemsWithPayload(
    activeContextMenuItems: INewContexMenuItem[],
    payload: INewTableCellNativeEvent,
  ): INewContexMenuItem[] {
    return activeContextMenuItems.map(
      (activeContextMenuItem: INewContexMenuItem) => {
        const newActiveContextMenuItems = {
          ...activeContextMenuItem,
          payload: payload,
        };

        if (!!newActiveContextMenuItems.children?.length) {
          newActiveContextMenuItems.children =
            generateContextMenuItemsWithPayload(newActiveContextMenuItems.children, payload);
        }

        return newActiveContextMenuItems;
      },
    );
  }

  return {
    generateContextMenuItemsWithPayload,
  };
}