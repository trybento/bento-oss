import { addMethod, string } from 'yup';
import { isUndefined, isNull } from 'lodash';
import tinycolor from 'tinycolor2';

declare module 'yup' {
  interface StringSchema {
    hexColor(message?: string): this;
    castEmptyToNull(): this;
  }
}

addMethod(string, 'hexColor', function (message) {
  return this.test('hexColor', message, function (value) {
    const { path, createError } = this;

    // undefined values will be treated as valid,
    // so you should use yup's `required()` rule accordingly
    if (isUndefined(value) || isNull(value) || value === '') {
      return true;
    }

    if (tinycolor(value).isValid() === false) {
      return createError({
        path,
        message: message ?? `${path} is not a valid HEX color`,
      });
    }

    return true;
  });
});

addMethod(string, 'castEmptyToNull', function () {
  return this.transform((value) =>
    isUndefined(value) || isNull(value) || value === '' ? null : value
  );
});
