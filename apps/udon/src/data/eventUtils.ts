import { uniqBy } from 'lodash';
import { AtLeast } from 'bento-common/types';

import { GuideStepBase } from 'src/data/models/GuideStepBase.model';
import {
  availableGuidesChanged,
  guideBaseChanged,
  guideChanged,
  stepAutoCompleteInteractionsChanged,
} from 'src/data/events';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { Guide } from 'src/data/models/Guide.model';
import { GuideBase } from 'src/data/models/GuideBase.model';
import { GuideParticipant } from './models/GuideParticipant.model';
import { Module } from 'src/data/models/Module.model';
import { Step } from 'src/data/models/Step.model';
import { Template } from 'src/data/models/Template.model';
import detachPromise from 'src/utils/detachPromise';
import getUsersOfGuide from 'src/interactions/analytics/stats/getUsersOfGuide';
import getUsersOfGuideBases from 'src/interactions/analytics/stats/getUsersOfGuideBase';
import { queryRunner } from '.';

export function triggerGuideChangedForSteps(steps: AtLeast<Step, 'guideId'>[]) {
  detachPromise(
    () =>
      (async () => {
        const guides = await Guide.findAll({
          where: {
            id: steps.map((step) => step.guideId),
          },
          attributes: ['entityId'],
        });

        for (const { entityId } of guides) {
          guideChanged(entityId);
        }
      })(),
    'trigger guide changed (from steps)'
  );
}

export function triggerGuideBaseChangedForSteps(steps: Step[]) {
  detachPromise(
    () =>
      (async () => {
        const guideBases = await GuideStepBase.findAll({
          where: {
            id: steps.map((s) => s.createdFromGuideStepBaseId),
          },
          attributes: ['entityId'],
          include: [
            {
              model: GuideBase,
              attributes: ['entityId'],
              required: true,
            },
          ],
        }).then((collection) => collection.map((gsb) => gsb.guideBase));

        for (const { entityId } of uniqBy(guideBases, 'entityId')) {
          guideBaseChanged(entityId);
        }
      })(),
    'trigger guide base changed (from steps)'
  );
}

export function triggerAvailableGuidesChangedForAccountUsers(
  accountUsers: AccountUser[]
) {
  for (const { externalId } of accountUsers) {
    availableGuidesChanged(externalId);
  }
}

export function triggerAvailableGuidesChangedForGuides(
  guides: Pick<Guide, 'id'>[]
) {
  detachPromise(
    () =>
      (async () => {
        const guideParticipants = await getUsersOfGuide(
          guides.map((g) => g.id)
        );

        for (const { accountUserExternalId } of guideParticipants) {
          availableGuidesChanged(accountUserExternalId);
        }
      })(),
    'trigger available guides changed (from guides)'
  );
}

export function triggerAvailableGuidesChangedForGuideBases(
  guideBases: Pick<GuideBase, 'id'>[],
  delayed?: true
): () => void;
export function triggerAvailableGuidesChangedForGuideBases(
  guideBases: Pick<GuideBase, 'id'>[],
  delayed?: false
): void;
export function triggerAvailableGuidesChangedForGuideBases(
  guideBases: Pick<GuideBase, 'id'>[],
  delayed?: boolean
): void | (() => void) {
  const trigger = () =>
    detachPromise(async () => {
      const guideParticipants = await getUsersOfGuideBases(
        guideBases.map((gb) => gb.id)
      );

      for (const { accountUserExternalId } of guideParticipants) {
        availableGuidesChanged(accountUserExternalId);
      }
    }, 'trigger available guides changed (from guideBases)');
  if (delayed) {
    return trigger;
  }
  trigger();
}

export function triggerAvailableGuidesChangedForTemplates(
  templates: Template[]
) {
  detachPromise(
    () =>
      (async () => {
        const accountUsers = (await queryRunner({
          sql: `--sql
            SELECT
              account_users.external_id as "accountUserExternalId"
            FROM
              core.modules
              JOIN core.templates_modules ON modules.id = templates_modules.module_id
              JOIN core.templates ON templates.id = templates_modules.template_id
              JOIN core.guide_bases ON guide_bases.created_from_template_id = templates.id
              JOIN core.guides ON guides.created_from_guide_base_id = guide_bases.id
              JOIN core.guide_participants ON guide_participants.guide_id = guides.id
              JOIN core.account_users ON account_users.id = guide_participants.account_user_id
            WHERE
              templates.id IN (:templateIds)
            GROUP BY
              account_users.external_id;
          `,
          replacements: {
            templateIds: templates.map((t) => t.id),
          },
        })) as { accountUserExternalId: string }[];

        for (const { accountUserExternalId } of accountUsers) {
          availableGuidesChanged(accountUserExternalId);
        }
      })(),
    'trigger available guides changed (from templates)'
  );
}

export function triggerAvailableGuidesChangedForModules(modules: Module[]) {
  detachPromise(
    () =>
      (async () => {
        const accountUsers = (await queryRunner({
          sql: `--sql
            SELECT
              account_users.external_id as "accountUserExternalId"
            FROM
              core.modules
              JOIN core.templates_modules ON modules.id = templates_modules.module_id
              JOIN core.templates ON templates.id = templates_modules.template_id
              JOIN core.guide_bases ON guide_bases.created_from_template_id = templates.id
              JOIN core.guides ON guides.created_from_guide_base_id = guide_bases.id
              JOIN core.guide_participants ON guide_participants.guide_id = guides.id
              JOIN core.account_users ON account_users.id = guide_participants.account_user_id
            WHERE
              modules.id IN (:moduleIds)
            GROUP BY
              account_users.external_id;
          `,
          replacements: {
            moduleIds: modules.map((m) => m.id),
          },
        })) as { accountUserExternalId: string }[];

        for (const { accountUserExternalId } of accountUsers) {
          availableGuidesChanged(accountUserExternalId);
        }
      })(),
    'trigger available guides changed (from module)'
  );
}

export function triggerStepAutoCompleteInteractionsChangedForGuides(
  guides: AtLeast<Guide, 'id'>[]
) {
  detachPromise(
    () =>
      (async () => {
        const accountUsers = await AccountUser.findAll({
          attributes: ['externalId'],
          include: [
            {
              model: GuideParticipant,
              required: true,
              attributes: [],
              where: { guideId: guides.map((g) => g.id) },
            },
          ],
        });

        for (const { externalId } of accountUsers) {
          stepAutoCompleteInteractionsChanged(externalId);
        }
      })(),
    'trigger step auto complete interactions changed (from guides)'
  );
}
