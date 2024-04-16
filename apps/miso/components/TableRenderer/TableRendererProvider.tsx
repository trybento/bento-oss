import React, { createContext, useContext, useState } from 'react';
import { TableRendererOrderDirectionType } from '.';
import { TABLES_SINGLE_SORT } from './tables.helpers';

interface TableSorting {
  [tableType: string]: {
    id?: any;
    direction?: TableRendererOrderDirectionType;
  };
}

const TableRendererContext = createContext({
  selectedSorting: {},
  handleSorting: (_id: any, _isSortedDesc: boolean, _tableType?: string) => {},
});

export function useTableRenderer() {
  const { selectedSorting, handleSorting } = useContext(TableRendererContext);

  return { selectedSorting, handleSorting };
}

export default function TableRendererProvider({ children }) {
  const [selectedSorting, setSelectedSorting] = useState<TableSorting>(
    TABLES_SINGLE_SORT as TableSorting
  );

  const handleSorting = (
    id: any,
    isSortedDesc: boolean,
    tableType = 'table'
  ) => {
    // Let backend pick default sorting if "orderBy" is undefined.
    const direction =
      id === undefined ? undefined : isSortedDesc ? 'desc' : 'asc';

    setSelectedSorting({
      ...selectedSorting,
      [tableType]: { id, direction },
    });
  };

  return (
    <TableRendererContext.Provider value={{ selectedSorting, handleSorting }}>
      {children}
    </TableRendererContext.Provider>
  );
}
