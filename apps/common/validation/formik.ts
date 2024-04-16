import { dset } from 'dset';
import { Struct, StructError } from 'superstruct';

/**
 * Helper method to easily validate Formik values against a Struct,
 * returning potential errors in a format friendly to Formik.
 */
export const validateStruct = <V>(struct: Struct) => {
  return function (values: V) {
    let errors: Object | undefined = undefined;
    const [result] = struct.validate(values);
    if (result instanceof StructError) {
      errors = Object.values(result.failures()).reduce(function (acc, failure) {
        // uses dset to easily write deep object values (e.g. errors.address.street)
        dset(acc, failure.path, failure.message);
        return acc;
      }, {});
    }
    return errors;
  };
};
