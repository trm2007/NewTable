import { INewReestrContexMenuItems } from "../components/NewReestr/types/newReestrContexMenuItems";
import { NEW_TABLE_DEFAULT_TYPE } from "../components/NewTable/constants/defaultRowType";

export const testContextMenuItems: INewReestrContexMenuItems = {
  [NEW_TABLE_DEFAULT_TYPE]: [
    {
      label: 'Row operations',
      children: [
        {
          label: 'Edit Row',
          actionName: 'edit-row',
          payload: event,
        },
        {
          label: 'Delete Row',
          actionName: 'delete-row',
          payload: event,
        },
      ],
    },
    {
      label: 'Cell operations',
      children: [
        {
          label: 'Show Cell Info',
          actionName: 'cell-info',
          payload: event,
        },

      ],
    },
    {
      label: 'Change row parent',
      actionName: 'change-row-parent',
      payload: event,
    },
  ]
};