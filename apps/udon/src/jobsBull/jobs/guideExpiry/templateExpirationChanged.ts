import { Op, Sequelize } from 'sequelize';
import { max } from 'lodash';
import { GuideExpirationCriteria, GuideState } from 'bento-common/types';

import { JobHandler } from 'src/jobsBull/handler';
import { Logger } from 'src/jobsBull/logger';
import { JobType, TemplateExpirationChangedJob } from 'src/jobsBull/job';
import { queueJob } from 'src/jobsBull/queues';
import { Template } from 'src/data/models/Template.model';
import { Guide } from 'src/data/models/Guide.model';
import { queryRunner } from 'src/data';
import NoContentError from 'src/errors/NoContentError';

/**
 * Determine how many guides can be processed in a single time.
 * NOTE: This only applies to templates set to expire based on step completion.
 */
const CHUNK_SIZE = 200;

export const templateExpirationChanged = async (
  { templateId, lastGuideId = 0 }: TemplateExpirationChangedJob,
  logger: Logger
) => {
  const template = await Template.scope('notArchived').findByPk(templateId, {
    attributes: ['id', 'organizationId', 'expireBasedOn', 'expireAfter'],
  });

  // if the template is missing, then it was likely deleted in the meantime
  if (!template) {
    throw new NoContentError(templateId, 'template');
  }

  // if the template is set to expire but "after X days" was not set
  if (
    template.expireBasedOn !== GuideExpirationCriteria.never &&
    !template.expireAfter
  ) {
    throw new Error(
      `Expected template to have 'expireAfter' set, but received: ${template.expireAfter}`
    );
  }

  let affectedRows = 0;
  let newLastGuideId: number | undefined;

  switch (template.expireBasedOn) {
    // Bulk update guides setting expireAt = null
    case GuideExpirationCriteria.never:
      [affectedRows] = await Guide.update(
        { expireAt: null },
        {
          where: {
            createdFromTemplateId: template.id,
            organizationId: template.organizationId,
            state: {
              [Op.notIn]: [GuideState.draft, GuideState.expired],
            },
          },
        }
      );
      break;

    // Bulk update guides setting expireAt = $launchedAt + $expireAfter
    case GuideExpirationCriteria.launch:
      [affectedRows] = await Guide.update(
        {
          expireAt: Sequelize.literal(
            `launched_at + INTERVAL '${template.expireAfter} days'`
          ),
        },
        {
          where: {
            createdFromTemplateId: template.id,
            organizationId: template.organizationId,
            state: {
              [Op.notIn]: [GuideState.draft, GuideState.expired],
            },
          },
        }
      );
      break;

    // Bulk update guides setting expireAt = ($lastStepCompletion or $launchedAt) + $expireAfter
    case GuideExpirationCriteria.stepCompletion:
      [affectedRows, newLastGuideId] =
        await templateExpirationChangedToStepCompletion(template, lastGuideId);

      // queue the next batch
      if (affectedRows && newLastGuideId) {
        logger.info(
          `Queuing next batch for tempalte #${template.id} (${newLastGuideId}:${CHUNK_SIZE})`
        );
        await queueJob({
          jobType: JobType.TemplateExpirationChanged,
          templateId: template.id,
          lastGuideId: newLastGuideId,
        });
      }
      break;

    default:
      throw new Error(
        `Missing implementation for expiration criteria: ${template.expireBasedOn}`
      );
  }

  if (!affectedRows) {
    logger.info(`Found no guides of template #${template.id} to update`);
    return;
  }

  logger.info(
    `Updated expiration criteria of ${affectedRows} guides of template #${template.id}`
  );
};

export const templateExpirationChangedToStepCompletion = async (
  template: Template,
  lastGuideId: number
): Promise<
  [
    /** Number of rows affected */
    affectedCount: number,
    /** Last guide id affected, if any */
    lastGuideIdAffected: number | undefined
  ]
> => {
  const affectedGuides = (await queryRunner({
    sql: `--sql
      with
        guide_steps as (
          select
            g.id "guide_id",
            COALESCE(MAX(s.completed_at), g.launched_at, now()) "step_completed_at"
          from
            core.guides g
            left join core.steps s on (
              s.guide_id = g.id
              and s.completed_at is not null
            )
          where
            g.organization_id = :organizationId
            and g.id > :lastGuideId
            and g.created_from_template_id = :templateId
            and g.state not in ('draft', 'expired')
          group by
            g.id
          order by
            g.id ASC
          limit :limit
        )
      update
        core.guides
      set
        expire_at = guide_steps.step_completed_at + INTERVAL '${template.expireAfter} days'
      from
        guide_steps
      where
        id = guide_steps.guide_id
        and organization_id = :organizationId
      returning id;
    `,
    replacements: {
      organizationId: template.organizationId,
      templateId: template.id,
      lastGuideId,
      limit: CHUNK_SIZE,
    },
  })) as { id: number }[];

  const newLastGuideId = max(affectedGuides.map((affected) => affected.id));

  return [affectedGuides.length, newLastGuideId];
};

const handler: JobHandler<TemplateExpirationChangedJob> = async (
  job,
  logger
) => {
  await templateExpirationChanged(job.data, logger);
};

export default handler;
