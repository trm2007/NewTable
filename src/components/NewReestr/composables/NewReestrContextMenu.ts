import type { INewMenuItem } from "../../NewContextMenu/types";
import type { INewTableCellNativeEvent } from "../../NewTable/types/NewTableEventTypes";

export function useNewReestrContextMenu(
  // activeContextMenuItems: Ref<INewContexMenuItem[]> | INewContexMenuItem[] | (() => INewContexMenuItem[]),
) {
  function generateContextMenuItemsWithPayload(
    activeContextMenuItems: INewMenuItem[],
    payload: INewTableCellNativeEvent,
  ): INewMenuItem[] {
    return activeContextMenuItems.map(
      (activeContextMenuItem: INewMenuItem) => {
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