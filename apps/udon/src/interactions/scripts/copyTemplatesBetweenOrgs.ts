import { TemplateState } from 'src/../../common/types';
import { withTransaction } from 'src/data';
import { Module } from 'src/data/models/Module.model';
import { ModuleStepPrototype } from 'src/data/models/ModuleStepPrototype.model';
import { Organization } from 'src/data/models/Organization.model';
import { StepPrototype } from 'src/data/models/StepPrototype.model';
import { Template } from 'src/data/models/Template.model';
import { TemplateModule } from 'src/data/models/TemplateModule.model';

import { logger } from 'src/utils/logger';

export async function copyTemplatesBetweenOrgs(
  fromOrgSlug: string,
  toOrgSlug: string
) {
  logger.info(
    `[TEMPLATE COPY] Copying templates from ${fromOrgSlug} to ${toOrgSlug}`
  );
  await withTransaction(async () => {
    const fromOrg = await Organization.findOne({
      where: {
        slug: fromOrgSlug,
      },
    });

    if (!fromOrg) {
      throw new Error(
        `[TEMPLATE COPY] Organization not found with slug: ${fromOrgSlug}`
      );
    }

    const toOrg = await Organization.findOne({
      where: {
        slug: toOrgSlug,
      },
    });

    if (!toOrg) {
      throw new Error(
        `[TEMPLATE COPY] Organization not found with slug: ${toOrgSlug}`
      );
    }

    const originalStepPrototypes = await StepPrototype.findAll({
      where: {
        organizationId: fromOrg.id,
      },
    });

    const originalModules = await Module.findAll({
      where: {
        organizationId: fromOrg.id,
      },
    });

    const originalTemplates = await Template.findAll({
      where: {
        organizationId: fromOrg.id,
      },
    });

    const originalModulesStepPrototypes = await ModuleStepPrototype.findAll({
      where: {
        organizationId: fromOrg.id,
      },
    });

    const originalTemplateModules = await TemplateModule.findAll({
      where: {
        organizationId: fromOrg.id,
      },
    });

    const createdStepPrototypeAttrs = originalStepPrototypes.map((sp) => ({
      name: sp.name,
      body: sp.body,
      bodySlate: sp.bodySlate,
      inputType: sp.inputType,
      organizationId: toOrg.id,
    }));

    const createdStepPrototypes = await StepPrototype.bulkCreate(
      createdStepPrototypeAttrs,
      {
        returning: true,
      }
    );

    const createdStepPrototypesByOriginalId = createdStepPrototypes.reduce(
      (acc, currentValue, idx) => {
        const originalStepPrototype = originalStepPrototypes[idx];
        acc[originalStepPrototype.id] = currentValue;
        return acc;
      },
      {}
    );

    const createdModuleAttrs = originalModules.map((m) => ({
      name: m.name,
      organizationId: toOrg.id,
    }));

    const createdModules = await Module.bulkCreate(createdModuleAttrs, {
      returning: true,
    });

    const createdModulesByOriginalId = createdModules.reduce(
      (acc, currentValue, idx) => {
        const originalModule = originalModules[idx];
        acc[originalModule.id] = currentValue;
        return acc;
      },
      {}
    );

    const createdTemplatesAttrs = originalTemplates.map((t) => ({
      name: t.name,
      /** @todo cleanup displayTitle */
      displayTitle: t.displayTitle,
      privateName: t.privateName,
      description: t.description,
      type: t.type,
      autoLaunchForAccountsCreatedAfter: t.autoLaunchForAccountsCreatedAfter,
      autoLaunchForAccountUsersCreatedAfter:
        t.autoLaunchForAccountUsersCreatedAfter,
      organizationId: toOrg.id,
      state: TemplateState.draft,
    }));

    const createdTemplates = await Template.bulkCreate(createdTemplatesAttrs, {
      returning: true,
    });

    const createdTemplatesByOriginalId = createdTemplates.reduce(
      (acc, currentValue, idx) => {
        const originalTemplate = originalTemplates[idx];
        acc[originalTemplate.id] = currentValue;
        return acc;
      },
      {}
    );

    const createdModuleStepPrototypeAttrs = originalModulesStepPrototypes.map(
      (msp) => ({
        orderIndex: msp.orderIndex,
        moduleId: createdModulesByOriginalId[msp.moduleId!].id,
        stepPrototypeId:
          createdStepPrototypesByOriginalId[msp.stepPrototypeId!].id,
        organizationId: toOrg.id,
      })
    );

    await ModuleStepPrototype.bulkCreate(createdModuleStepPrototypeAttrs, {
      returning: true,
    });

    const createdTemplateModuleAttrs = originalTemplateModules.map((tm) => ({
      orderIndex: tm.orderIndex,
      moduleId: createdModulesByOriginalId[tm.moduleId].id,
      templateId: createdTemplatesByOriginalId[tm.templateId].id,
      organizationId: toOrg.id,
    }));

    await TemplateModule.bulkCreate(createdTemplateModuleAttrs, {
      returning: true,
    });
  });

  logger.info(
    `[TEMPLATE COPY] Finished copying templates from ${fromOrgSlug} to ${toOrgSlug}`
  );
}
