import { $enum } from 'ts-enum-util';
import { DataType, Column } from 'sequelize-typescript';
import { ModelAttributeColumnOptions } from 'sequelize/types';

type EnumType = { [key: number]: string } | (() => { [key: number]: string });

/**
 * Decorator helper for enum type columns
 */
export function EnumColumn(
  field: string,
  enumType: EnumType,
  columnConfig?: Partial<ModelAttributeColumnOptions>
): Function;
export function EnumColumn(
  enumType: EnumType,
  columnConfig?: Partial<ModelAttributeColumnOptions>
): Function;
export function EnumColumn(
  field: string | EnumType,
  enumType?: EnumType | Partial<ModelAttributeColumnOptions>,
  columnConfig: Partial<ModelAttributeColumnOptions> = {}
): Function {
  const columnField = typeof field === 'string' ? field : undefined;
  const e = columnField ? enumType : field;
  const config = typeof field === 'string' ? columnConfig : enumType;
  return (...args: any[]) => {
    Column({
      field: columnField,
      type: DataType.ENUM(...$enum(e!).getValues()),
      ...config,
    })(...args);
  };
}
