import promises from 'src/utils/promises';
import isUuid from 'is-uuid';
import { keyBy } from 'lodash';

import { logger } from 'src/utils/logger';

import { notArchivedCondition, withTransaction } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { Account } from 'src/data/models/Account.model';

export function convertToUuid(originalId: string) {
  try {
    if (isUuid.anyNonNil(originalId)) return originalId;

    const bufferObj = Buffer.from(originalId, 'base64');
    const decodedString = bufferObj.toString('utf8');

    const idObj = JSON.parse(decodedString);

    const newUuid = idObj.id;

    if (!newUuid) return originalId;

    return newUuid;
  } catch (e) {
    return originalId;
  }
}

export async function transformCourierUuids(orgSlug: string) {
  return withTransaction(async () => {
    const organization = await Organization.findOne({
      where: {
        slug: orgSlug,
      },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const accounts = await Account.findAll({
      where: {
        organizationId: organization.id,
        ...notArchivedCondition,
      },
    });

    const accountsByExternalId = keyBy(accounts, 'externalId');

    let changedAccounts = 0;
    await promises.map(accounts, async (account) => {
      logger.debug(
        `STARTED ON ACCOUNT NAME ${account.name} WITH EXTERNAL ID ${account.externalId}`
      );
      const originalExternalId = account.externalId;
      if (!originalExternalId) return;

      if (isUuid.anyNonNil(originalExternalId)) {
        logger.debug(
          `ACCOUNT ${account.name} WITH EXTERNAL ID ${originalExternalId} ALREADY HAS UUID, DOING NOTHING`
        );
        return;
      }

      if (originalExternalId!.includes('duplicate')) {
        logger.debug(
          `ACCOUNT NAME ${account.name} WITH EXTERNAL ID ${account.externalId} ALREADY MODIFIED`
        );
        return;
      }

      let realId;
      try {
        const bufferObj = Buffer.from(originalExternalId, 'base64');
        const decodedString = bufferObj.toString('utf8');

        const idObj = JSON.parse(decodedString);

        realId = idObj.id;
      } catch (e) {
        logger.error(
          `RAN INTO ERROR CONVERTING UUID ${originalExternalId} FOR ACCOUNT ${account.name}`
        );
        return;
      }

      if (!realId || realId === originalExternalId) {
        logger.debug(
          `DID NOT CHANGE UUID FOR ACCOUNT ${account.name}, ENTITY_ID ${account.entityId}`
        );
        return;
      }

      const existingAccountWithRealId = accountsByExternalId[realId];

      let updatedAttributes = {};
      if (existingAccountWithRealId) {
        updatedAttributes = existingAccountWithRealId.attributes;

        logger.debug(
          `UPDATING DUPLICATE ACCOUNT WITH GOOD ID ${existingAccountWithRealId.externalId} TO DUPLICATE ID duplicate_${existingAccountWithRealId.externalId}`
        );
        await existingAccountWithRealId.update({
          externalId: `duplicate_${existingAccountWithRealId.externalId}`,
        });
      }

      logger.debug(
        `UPDATING ACCOUNT WITH BAD EXTERNAL ID ${account.externalId} TO GOOD ID ${realId}`
      );
      await account.update({
        externalId: realId,
        attributes: { ...account.attributes, ...updatedAttributes },
      });

      logger.debug(
        `CHANGED UUID FOR ACCOUNT ${account.name}, ENTITY_ID ${account.entityId}`
      );
      changedAccounts++;
    });

    logger.info(`CHANGED ${changedAccounts} ACCOUNTS`);
  });
}
