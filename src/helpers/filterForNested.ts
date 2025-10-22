import type { INewTableFilter } from "../components/NewTable/types/NewTableFilterTypes";
import type { INewTableRow } from "../components/NewTable/types/NewTableRowTypes";
import { compareFilterAsString } from "./compareFilterAsString";

/**
 * @TODO тут нужно оптимизировать работу этого алгоритма,
 * сейчас рекурсивно функция вызывается несколько раз для одной и той же ветки/элемента,
 * можно создать какой-то массив id-шников для записей прошедших фильтрацию, 
 * чтобы несколько раз не проверять одно и то же
 * 
 * Рекурсивная функция для проверки подходит ли объект DataItem под фильтр Filters,
 * при этом реализована логика проверки с учетом вложений.
 * Например, есть строка, у которой значения не подходят под фильтр, и для неё как бы нужно вернуть false,
 * НО, если у нее есть дочерний элемент, который удовлетворяет поиску, то этот дочерний элемент-строка
 * должен попасть в выборку, для него нужно вернуть true, но тогда и для проверяемого родителя тоже нужно вернуть true,
 * чтобы сохранилась структура дерева
 * 
 * @param {String} filter - значение фильтра для данной колонки
 * @param {*} currentValue - значение, которое лежит в проверяемф ячейке
 * @param {String} cellName - индекс проверяемой колонки
 * @param {Object} dataItem - объект, который нужно проверить, подходят ли его значения под фильтр
 * @param {Array} filters - массив значений для фильтрации ячеек
 * @param {Array} dataArray - массив всех объектов,
 * может понадобиться для проверки значений у детей, или, наоборот у родителя
 * @param {String} dataIndex - индекс, под которым в наборе данных лежат непосредственно проверяемые и отображаемые данные
 * @param {String} childrenIndex - индекс, под которым в наборе данных могут лежать дочерние элементы (в случае дерева)
 * 
 * @returns true - если набор данных (строка) DataItem должен отображаться, false - если DataItem фильтрацию не прошел
 */
export function filterForNested(
    filter: string,
    currentValue: any,
    cellName: string,
    dataItem: INewTableRow,
    filters: string[],
    dataArray: INewTableRow[],
    dataIndex: string = "data",
    childrenIndex: string = "children"
): boolean {
    // если фильтр не установлен, то возвращаем true (элемент проходит фильтрацию)
    if (filter === "" || filter === null || filter === undefined) {
        return true;
    }

    // Если значения равны, элемент проходит фильтрацию
    if (filter == currentValue) {
        return true;
    }

    // Проверяем текущее значение на соответствие фильтру
    let currentRes = compareFilterAsString(
        String(filter),
        String(currentValue)
    );

    // если для этого набора данных фильтр не сработал, то нужно проверить дочерние элементы
    if (
        !currentRes
        && (childrenIndex in dataItem)
        && Array.isArray(dataItem[childrenIndex as keyof INewTableRow])
        && (dataItem[childrenIndex as keyof INewTableRow] as INewTableRow[]).length > 0
    ) {
        // если для какого-то из дочерних элементов фильтр сработает, то нужно отображать и родителя
        currentRes = !!(dataItem[childrenIndex as keyof INewTableRow] as INewTableRow[])?.some(
            (currentChild: INewTableRow) => {
                const childValue = dataIndex in currentChild
                    ? (currentChild[dataIndex as keyof INewTableRow] as any)[cellName]
                    : currentChild[cellName as keyof INewTableRow];
                return filterForNested(
                    filter,
                    childValue,
                    cellName,
                    currentChild,
                    filters,
                    dataArray,
                    dataIndex,
                    childrenIndex
                );
            }
        );
    }

    return currentRes;
}

/**
 * Генерирует отфлиотрованные данные,
 * с учетом того, что нужная строка может быть в дочерних элементах,
 * но в выборку попадет и её родитель, чтобы можно было его развернуть и увидеть дочернюю,
 * которая попадает под критерии фильтров
 * @param {INewTableFilter} currentFilter объект фильтра для колонки
 * @param {string} currentColumnName имя колонки
 * @param {INewTableRow[]} currentData все данные
 * @returns {INewTableRow[]} отфильтрованные данные с учетом вложений
 */
export function generateFilteredDataForNested(
    currentFilter: INewTableFilter,
    currentColumnName: string,
    currentData: INewTableRow[],
): INewTableRow[] {
    const resultData: INewTableRow[] = [];

    currentData.forEach(
        (currentRow: INewTableRow) => {
            const resultRow: INewTableRow = {
                ...currentRow,
                children: [],
            };

            if (!!currentRow.children?.length) {
                resultRow.children = generateFilteredDataForNested(
                    currentFilter,
                    currentColumnName,
                    currentRow.children
                );
            }

            if (
                !!resultRow.children?.length
                || currentFilter.currentValue === currentFilter.defaultValue
                || (('compare' in currentFilter && typeof currentFilter.compare === 'function')
                    ? currentFilter.compare(currentFilter.currentValue, currentColumnName, currentRow, currentData)
                    : compareFilterAsString(currentFilter.currentValue, resultRow.data[currentColumnName])
                )
            ) {
                resultData.push(resultRow);
            }
        },
    );

    return resultData;
}