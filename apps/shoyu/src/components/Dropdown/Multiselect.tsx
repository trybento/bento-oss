import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPopper } from '@popperjs/core';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import { SelectOptionProps } from '../../system/Select';
import Dropdown from './Dropdown';
import useEventListener from '../../hooks/useEventListener';

const MAX_SELECTION_SHOWN = 1;

export type MultiSelectOption = SelectOptionProps & { selected: boolean };

interface MultiselectProps {
  defaultValue?: string | string[] | SelectOptionProps[];
  isDisabled?: boolean;
  placeholder?: string;
  onChange?: (newValue: SelectOptionProps[]) => void;
  onMenuClose?: () => void;
  options: SelectOptionProps[];
  className?: string;
}

function initDefaultValue(
  value: string | string[] | SelectOptionProps[] | undefined,
  options: SelectOptionProps[]
): MultiSelectOption[] {
  if (!options) return [];
  const _values: { [key: string]: boolean } = {};

  if (value?.length) {
    if (typeof value === 'string') {
      value.split(',').forEach((v) => {
        _values[`${v}`] = true;
      });
    } else if (Array.isArray(value) && typeof value[0] === 'string') {
      value.forEach((v) => {
        _values[`${v}`] = true;
      });
    } else {
      value.forEach((v) => {
        _values[`${v.value}`] = true;
      });
    }
  }

  return options.map((o) => {
    return { ...o, selected: !!_values[o.value] };
  });
}

const Selection = memo(
  ({ selectedItems }: { selectedItems: MultiSelectOption[] }) => {
    const _selectedItems = selectedItems.filter((i) => i.selected);

    const shownText = _selectedItems
      .slice(0, MAX_SELECTION_SHOWN)
      .reduce((a, item) => (a ? ', ' : '') + item.label, '');

    const overflow = _selectedItems
      .slice(MAX_SELECTION_SHOWN)
      .map((x) => x.label);

    if (!shownText) return null;

    return (
      <div className="w-full flex inline select-none">
        <div className="truncate mr-auto ml-1 self-center">{shownText}</div>
        {!!overflow.length && (
          <div className="whitespace-nowrap mr-1 self-center">
            +{overflow.length} more
          </div>
        )}
      </div>
    );
  }
);

const Multiselect = ({
  defaultValue,
  onChange,
  onMenuClose,
  placeholder = 'Select an option',
  options = [],
  isDisabled,
  className,
}: MultiselectProps) => {
  const btnDropdownRef = useRef<HTMLDivElement>(null);
  const popoverDropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [selectedItems, setSelected] = useState<MultiSelectOption[]>(
    initDefaultValue(defaultValue, options)
  );

  const sanitizedSelectedItems = useMemo(
    () =>
      selectedItems
        .filter((i) => i.selected)
        .map((i) => {
          const { selected, ...restI } = i;
          return { ...restI };
        }),
    [selectedItems]
  );

  const toogleDropdown = useCallback(
    (e: React.MouseEvent) => {
      if (isDisabled) return;

      e.preventDefault();
      e.stopPropagation();

      if (isOpen) {
        onMenuClose?.();
      } else {
        createPopper(
          btnDropdownRef.current as Element,
          popoverDropdownRef.current as HTMLElement,
          {
            placement: 'bottom-start',
          }
        );
      }

      setIsOpen(!isOpen);
    },
    [isOpen, onMenuClose, isDisabled]
  );

  const windowClickEvent = useCallback(() => {
    if (!isOpen || isDisabled) return;

    onMenuClose?.();
    setIsOpen(false);
  }, [isOpen, onMenuClose, isDisabled]);

  const addItem = useCallback(
    (item) => {
      if (isDisabled) return;

      setSelected(
        selectedItems.map((i) => {
          const match = i.label === item.label && i.value === item.value;
          if (!match) return i;
          return { ...i, selected: !i.selected };
        })
      );
    },
    [selectedItems, isDisabled]
  );

  useEventListener(document, 'click', windowClickEvent);

  useEffect(() => {
    onChange?.(sanitizedSelectedItems);
  }, [sanitizedSelectedItems]);

  return (
    <div
      onClick={toogleDropdown}
      className={cx(className, 'text-xs')}
      ref={btnDropdownRef}
    >
      <div className="w-full flex flex-col items-center mx-auto">
        <div className="relative w-full">
          <div className="flex flex-col items-center relative">
            <div className="w-full">
              <div
                className={cx(
                  'p-1 flex border border-gray-200 bg-white rounded',
                  {
                    'outline outline-blue-500 outline-2': isOpen,
                    'hover:border-gray-300': !isDisabled,
                  }
                )}
              >
                <div className="w-10/12 flex flex-auto flex-wrap overflow-hidden">
                  {sanitizedSelectedItems.length ? (
                    <Selection selectedItems={selectedItems} />
                  ) : (
                    <div className="ml-1 self-center overflow-hidden truncate text-gray-500 select-none">
                      {placeholder}
                    </div>
                  )}
                </div>
                <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
                  <div className="w-6 h-6 text-gray-400">
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      focusable="false"
                      fill="currentColor"
                    >
                      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!!btnDropdownRef.current &&
            ReactDOM.createPortal(
              <Dropdown
                list={selectedItems}
                onItemSelected={addItem}
                ref={popoverDropdownRef}
                width={btnDropdownRef.current?.clientWidth}
                isOpen={isOpen}
              />,
              btnDropdownRef.current?.getRootNode() as Element
            )}
        </div>
      </div>
    </div>
  );
};

export default Multiselect;
