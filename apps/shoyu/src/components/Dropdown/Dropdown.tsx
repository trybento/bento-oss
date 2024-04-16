import React, { useMemo } from 'react';
import { SIDEBAR_Z_INDEX } from '../../lib/constants';
import { MultiSelectOption } from './Multiselect';

const DEFAULT_WIDTH = 100;
const MAX_HEIGHT = 165;

const Dropdown = React.forwardRef(
  (
    {
      list = [],
      onItemSelected,
      isOpen,
      width = DEFAULT_WIDTH,
    }: {
      list: MultiSelectOption[];
      onItemSelected: any;
      isOpen: boolean;
      width?: number;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const handleItemSelected = useMemo(
      () =>
        list.reduce(
          (a, item) => ({
            ...a,
            [item.value]: (e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              onItemSelected(item);
            },
          }),
          {}
        ),
      [list, onItemSelected]
    );

    return (
      <div
        ref={ref}
        className="absolute"
        style={{
          width,
          height: MAX_HEIGHT,
          display: isOpen ? 'block' : 'none',
          zIndex: SIDEBAR_Z_INDEX + 1,
        }}
      >
        <div
          className="shadow bg-white rounded h-auto overflow-y-auto"
          style={{ maxHeight: MAX_HEIGHT }}
        >
          <div className="flex flex-col w-full">
            {list.map((item, key) => {
              return (
                <div
                  key={`${key}-${item.value}`}
                  className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-blue-100"
                  onClick={handleItemSelected[item.value]}
                >
                  <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-blue-100">
                    <div className="w-full items-center flex">
                      <input
                        type="checkbox"
                        className="pointer-events-none"
                        checked={item.selected}
                        readOnly
                      />
                      <div className="text-xs truncate mx-2 leading-6 select-none">
                        {item.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

export default Dropdown;
