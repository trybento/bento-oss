import {
  ExtractedFilterSelections,
  TableFilters,
} from 'bento-common/types/filters';

export const getFilterSelectionsRecord = (filters: TableFilters) =>
  Object.entries(filters).reduce((filtersAcc, [label, filter]) => {
    if (filter.isSelected) {
      filtersAcc[label] = filter.options.reduce((optionsAcc, o) => {
        if (o.isSelected) {
          optionsAcc[o.value] = true;
        }
        return optionsAcc;
      }, {} as Record<string, boolean>);
    }
    return filtersAcc;
  }, {} as ExtractedFilterSelections);
