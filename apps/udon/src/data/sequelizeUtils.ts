import {
  ModelStatic,
  Model,
  UpsertOptions,
  Utils,
  CreationAttributes,
} from 'sequelize';
import { camelToSnakeCase } from 'bento-common/utils/strings';

import { logger } from 'src/utils/logger';
import promises from 'src/utils/promises';

type ModelCreationData<T extends Model> = Utils.MakeNullishOptional<
  CreationAttributes<T>
>;

type AdditionalBulkUpsertCommonArgs<T extends Model> = {
  /** Allow operation to continue even if one upsert fails */
  ignoreErrors?: boolean;
  /** Actual options for upsert passed to Sequelize. Separated for explicitness */
  upsertOpts?: UpsertOptions<T>;
  /** Perform special action on errors. Fires even if ignore error is true */
  onError?: (e: Error, row: ModelCreationData<T>) => void;
  /** Allow creating multiple at once */
  concurrency?: number;
};

/**
 * Sequelize doesn't handle conflictFields well with bulkCreate, so
 *   we have to hack around that with a promise loop with upsert.
 *
 * We should only prefer to use this where there is an issue with constraints
 *   otherwise it is better to have true bulk queries.
 */
export const sequelizeBulkUpsert = async <T extends Model>(
  model: ModelStatic<T>,
  upsertData: Array<ModelCreationData<T>>,
  {
    ignoreErrors,
    onError,
    upsertOpts,
    concurrency = 1,
  }: AdditionalBulkUpsertCommonArgs<T> = {}
) => {
  const ret: T[] = [];

  await promises.each(
    upsertData,
    async (data) => {
      try {
        const [instance] = await model.upsert(
          data,
          !upsertOpts
            ? undefined
            : {
                ...upsertOpts,
                conflictFields: upsertOpts.conflictFields
                  ? upsertOpts.conflictFields.map((f) =>
                      camelToSnakeCase(String(f))
                    )
                  : undefined,
              }
        );

        if (upsertOpts?.returning && instance && !(instance instanceof Error))
          ret.push(instance);
      } catch (e: any) {
        onError?.(e, data);

        if (!ignoreErrors) throw e;

        /* If onError provided, let it handle the logging */
        if (!onError)
          logger.error(
            `[sequelizeBulkUpsert] error on upsert: ${e.message}`,
            e
          );
      }
    },
    { concurrency }
  );

  return ret;
};
