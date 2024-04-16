import { groupBy, isEmpty } from 'lodash';
import { Op, UniqueConstraintError } from 'sequelize';
import { SelectedModelAttrs, TargetValueType } from 'bento-common/types';

import { CustomAttribute } from 'src/data/models/CustomAttribute.model';
import { CustomAttributeValue } from 'src/data/models/CustomAttributeValue.model';
import { getCustomAttributeValueColumnName } from 'src/utils/helpers';
import { standardFields } from './recordEvents.helpers';
import { disableTransaction } from 'src/data';
import { logger } from 'src/utils/logger';
import { sequelizeBulkUpsert } from 'src/data/sequelizeUtils';
import detachPromise from 'src/utils/detachPromise';

type AttributeValue = string | number | Date | boolean;

type Args = {
  attributesToInsert: Array<Partial<CustomAttribute>>;
  attributeValuesByName: Record<string, Set<AttributeValue>>;
  organizationId: number;
  detach?: boolean;
};

/** Only need a handful to verify on data table */
const ALLOWED_VALUES_PER_ATTRIBUTE = 3;
/** Needs more for auto-populating */
const ALLOWED_TEXT_VALUES_PER_ATTRIBUTE = 75;

/**
 * Writes CustomAttribute and CustomAttributeValue data,
 *   while respecting that we don't want above a certain number
 */
export default async function persistCustomAttributes(args: Args) {
  if (args.detach) {
    detachPromise(() => handlePersist(args), 'persist custom attributes');
  } else {
    await handlePersist(args);
  }
}

const handlePersist = ({
  attributeValuesByName,
  attributesToInsert,
  organizationId,
}: Args) =>
  disableTransaction(async () => {
    await CustomAttribute.bulkCreate(attributesToInsert as CustomAttribute[], {
      ignoreDuplicates: true,
    });

    /* Lookup because bulk insert doesn't return id's */
    const customAttributes = (await CustomAttribute.findAll({
      where: {
        organizationId,
        [Op.or]: attributesToInsert.map(({ name, type }) => ({
          name,
          type,
        })),
      },
      attributes: ['id', 'name', 'type', 'valueType'],
    })) as SelectedModelAttrs<
      CustomAttribute,
      'id' | 'name' | 'type' | 'valueType'
    >[];

    if (isEmpty(attributeValuesByName)) return;

    const existingAttributeValues = await CustomAttributeValue.findAll({
      where: {
        customAttributeId: customAttributes.map((ca) => ca.id),
        organizationId,
      },
    });

    const existingAttributeValuesByAttributeId = groupBy(
      existingAttributeValues,
      'customAttributeId'
    );

    /** Prepare attr values to insert */
    const preparedValues = customAttributes.reduce((a, customAttribute) => {
      /* Prevent rows not from db */
      if (!customAttribute.id) return a;

      /* Skip storing standard values */
      const isStandardField = (
        standardFields[customAttribute.type!] as string[]
      ).includes(customAttribute.name);
      if (isStandardField) return a;

      const currentValues =
        existingAttributeValuesByAttributeId[customAttribute.id] ?? [];

      /* Limit values per attribute */
      const currentValuesCount = currentValues.length;
      const maxValuesForAttr = [
        TargetValueType.text,
        TargetValueType.stringArray,
      ].includes(customAttribute.valueType)
        ? ALLOWED_TEXT_VALUES_PER_ATTRIBUTE
        : ALLOWED_VALUES_PER_ATTRIBUTE;

      if (currentValuesCount >= maxValuesForAttr) return a;

      /* Make a set of existing values from database */
      const existingValues = currentValues.reduce((a, v) => {
        const val =
          v.textValue ?? v.numberValue ?? v.dateValue ?? v.booleanValue;
        if (!!val) a.add(formDedupeKey(val));
        return a;
      }, new Set<string>());

      /** Look up the new values for the attribute we're referencing */
      attributeValuesByName[customAttribute.name]?.forEach((value) => {
        /* Skip storing null and existing */
        if (
          existingValues.has(formDedupeKey(value)) ||
          existingValues.size >= maxValuesForAttr ||
          value === null ||
          (typeof value === 'string' && value.trim() === '')
        )
          return;

        /** Only store primitives and dates */
        if (typeof value === 'object' && !(value instanceof Date)) {
          logger.warn(
            `[persistCustomAttributes:preparedValues] ${customAttribute.name} had object value. Skipping`,
            { value, organizationId, valueType: customAttribute.valueType }
          );
          return;
        }

        const attrValueData = {
          organizationId,
          [getCustomAttributeValueColumnName(customAttribute.valueType)]: value,
          customAttributeId: customAttribute.id,
        };

        existingValues.add(formDedupeKey(value));
        a.push(attrValueData);
      });

      return a;
    }, [] as Array<Partial<CustomAttributeValue>>);

    await sequelizeBulkUpsert(CustomAttributeValue, preparedValues, {
      ignoreErrors: true,
      onError: (e, row) => {
        /** We don't need to warn on every dedupe */
        if (e.message?.includes('Validation')) return;
        if (e instanceof UniqueConstraintError) return;

        logger.warn(
          `[persistCustomAttributes] Error persisting attr value: ${e.message}, oId ${row.organizationId} caId ${row.customAttributeId}`,
          row
        );
      },
    });
  });

/**
 * Guarantee a string value for our dedupe lookup set
 *
 * We don't expect arbitrary obj, null, or undefined due to the
 * intended usage on AttributeValue types, but handle generically in
 * case of accidental usage
 */
export const formDedupeKey = (val: AttributeValue): string =>
  val === null
    ? 'null'
    : val === undefined
    ? 'undefined'
    : typeof val === 'object'
    ? val.toISOString
      ? val.toISOString()
      : JSON.stringify(val)
    : String(val);
