import compareFilterAsString from "New/NewTable/src/compareFilterAsString";

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
 * @param {String} Filter - значение фильтра для данной колонки
 * @param {*} CurrentValue - значение, которое лежит в проверяемф ячейке
 * @param {String} CurrentIndex - индекс проверяемой колонки
 * @param {Object} DataItem - объект, который нужно проверить, подходят ли его значения под фильтр
 * @param {Array} Filters - массив значений для фильтрации ячеек
 * @param {Array} DataArray - массив всех объектов,
 * может понадобиться для проверки значений у детей, или, наоборот у родителя
 * @param {String} DataIndex - индекс, под которым в наборе данных лежат непосредственно проверяемые и отображаемые данные
 * @param {String} ChildrenIndex - индекс, под которым в наборе данных могут лежать дочерние элементы (в случае дерева)
 * 
 * @returns true - если набор данных (строка) DataItem должен отображаться, false - если DataItem фильтрацию не прошел
 */
export function filterForNested(Filter, CurrentValue, CurrentIndex, DataItem, Filters, DataArray, DataIndex = "", ChildrenIndex = "children") {
    // если фильтр не установлен, то возвращаем полный набор данных
    if (Filter === "" || Filter === null || Filter === undefined || Filter == CurrentValue) {
        return true;
    }

    let CurrentRes = compareFilterAsString(
        String(Filter),
        String(CurrentValue)
    );

    // const FiltersKeys = Object.keys(Filters || {});

    // // если фильтров и правил нет, то возвращаем полный набор данных
    // if (!FiltersKeys.length) {
    //     return true;
    // }
    // let CurrentRes = FiltersKeys.every(CurrentFilterKey => {
    //     // если в фильтре значение для текушего элемента не установлено (пустая строка или нет),
    //     // то не проверям
    //     if (Filters[CurrentFilterKey] === "" || Filters[CurrentFilterKey] === null) {
    //         return true;
    //     }

    //     const CurrentValue = DataIndex ? DataItem[DataIndex][CurrentFilterKey] : DataItem[CurrentFilterKey];
    //     // если установлен фильтр,
    //     // то сравниваем значение ячейки со значением в фильтре для этой колонки,
    //     // если значение ячейки содержит значение фильтра (хотябы частично), то показываем...
    //     // все сравниваемые значения сначала преобразуем к строке
    //     if (
    //         compareFilterAsString(
    //             String(Filters[CurrentFilterKey]),
    //             String(CurrentValue)
    //         )
    //     ) {
    //         return true;
    //     }
    // });

    // если для этого набора данных фильтр не сработал, то нужно проверить нет ли дочерних элементов
    if (!CurrentRes && (ChildrenIndex in DataItem) && DataItem[ChildrenIndex].length) {
        // если для какого-то из дочерних элементов фильтр сработает, то нужно отображать и всех родителей!
        CurrentRes = DataItem[ChildrenIndex].some(CurrentChild => {
            const ChildValue = DataIndex ? CurrentChild[DataIndex][CurrentIndex] : CurrentChild[CurrentIndex]
            return filterForNested(Filter, ChildValue, CurrentIndex, CurrentChild, Filters, DataArray, DataIndex, ChildrenIndex);
        })
    }

    return CurrentRes;
}

export default filterForNested;