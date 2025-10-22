import type { INewTableColumn } from "../../../constants/columns";
import type { INewTableHeaderSetting } from "../../../constants/testColumnsSettings";

export function generateColumnWidths(
  visibleSortedColumns: INewTableColumn[],
  localColumnsSettings: Record<string, INewTableHeaderSetting>
): Record<string, string> {
  const widths: Record<string, string> = {};
  visibleSortedColumns.forEach((column) => {
    const localSetting = localColumnsSettings?.[column.key];
    if (localSetting?.width) {
      widths[column.key] = `${localSetting.width}px`;
    } else if (column.meta?.width) {
      widths[column.key] = `${column.meta.width}px`;
    } else {
      widths[column.key] = '';
    }
  });
  return widths;
}
