import { Ref, toValue } from "vue";

import type { INewTableRow } from "../../NewTable/components/NewTableRow/types/NewTableRowTypes";

import { TEST_DATA_ROW_TYPES } from "../../../constants/testData";
import { findParentRowWithChildIndexByChildRowId, findRowById } from "../../../helpers/finders";

export function useNewReestrChangeRowParent(
  initialData: Ref<INewTableRow[]> | INewTableRow[] | (() => INewTableRow[]),
) {
  /**
   * Так как в initialData могут быть большие данные,
   * то не клонируем их, а меняем напрямую, используем данные initialData!!!
   * @param sourceRow объект строки, который нужно переместить в дочерние элементы нового родителя
   * @param destinationRowId id нового родителя
   */
  function changeRowParent(
    sourceRow: INewTableRow,
    destinationRowId: number | string
  ): boolean {
    const destinationRow = findRowById(destinationRowId, toValue(initialData));

    if (!destinationRow) {
      console.warn('[changeRowParent] Wrong destinationRowId', destinationRowId);
      return false;
    }

    const sourceParentRow =
      findParentRowWithChildIndexByChildRowId(sourceRow.data.id, toValue(initialData));

    sourceParentRow.parent.children.splice(sourceParentRow.index, 1);

    if (!destinationRow.children) {
      destinationRow.children = [];
    }
    destinationRow.children.push(sourceRow);
    if (destinationRow.meta.rowType === TEST_DATA_ROW_TYPES.TASK) {
      destinationRow.meta.rowType = TEST_DATA_ROW_TYPES.SUB_STAGE;
    }

    return true;
  }

  return {
    changeRowParent,
  };
}