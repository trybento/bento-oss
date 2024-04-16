import promises from 'src/utils/promises';
import { Op } from 'sequelize';

import { queryRunner } from 'src/data';
import { Organization } from 'src/data/models/Organization.model';
import { Template } from 'src/data/models/Template.model';
import duplicateTemplate from './duplicateTemplate';

type Args = {
  targetOrganization: Organization;
};

export default async function seedGlobalDefaultTemplates({
  targetOrganization,
}: Args) {
  const sql = `
		SELECT template_id FROM core.global_default_templates
		WHERE enabled = TRUE
	`;

  const defaultTempalateIds = (await queryRunner({ sql })) as {
    template_id: number;
  }[];

  const templates = await Template.findAll({
    where: {
      id: { [Op.in]: defaultTempalateIds.map((r) => r.template_id) },
    },
  });

  return await promises.map(templates, async (template) => {
    return await duplicateTemplate({
      template,
      organization: targetOrganization,
      preserveName: true,
      markAsTemplate: true,
      useExistingModules: false,
    });
  });
}
