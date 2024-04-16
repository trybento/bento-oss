import React from 'react';
import { format } from 'date-fns';

import { hasOnlyDefaultCtas } from 'bento-common/data/helpers';
import { isEmptyBody } from 'bento-common/utils/bodySlate';
import { GuideFormFactor, Theme } from 'bento-common/types';

import { UsersQuery_users } from 'providers/UsersProvider';

import Avatar from 'system/Avatar';
import Tooltip from 'system/Tooltip';
import Box from 'system/Box';
import { StepPrototypeValue } from 'bento-common/types/templateData';

/*
 * For git history purposes this was moved from GuideForm/StepList
 */

export const formatCompletedBy = (
  accountGuideStep,
  usersDict: Record<string, UsersQuery_users[number]>
) => {
  if (!accountGuideStep) return null;

  const {
    completedByType,
    completedByAccountUser,
    completedByUser,
    completedAt,
  } = accountGuideStep;

  let label;

  let fullname;
  let avatarUrl;
  let email;

  if (!completedAt) {
    return null;
  }

  const _completedAt = format(new Date(completedAt as string), 'MMM dd, yyyy');

  if (completedByAccountUser) {
    fullname = completedByAccountUser?.fullName;
    email = completedByAccountUser?.email;
  } else {
    fullname = completedByUser?.fullName;
    email = completedByUser?.email;
    avatarUrl = completedByUser
      ? usersDict[completedByUser.email]?.avatarUrl
      : undefined;
  }

  const tooltipLabel = `${email}${
    completedByType === 'auto' ? ' autocompleted' : ''
  } on ${_completedAt}`;

  return (
    <Tooltip label={tooltipLabel} placement="top">
      {label ? (
        <span>{label}</span>
      ) : (
        <Box display="inline">
          <Avatar size="xs" name={fullname} src={avatarUrl} />
        </Box>
      )}
    </Tooltip>
  );
};

export const isEmptyStep = (
  step: StepPrototypeValue | undefined,
  guideFormFactor: GuideFormFactor | undefined,
  theme: Theme | undefined
) => {
  return (
    step &&
    !step.name &&
    !step.inputs?.length &&
    !step.eventMappings?.length &&
    !step.branchingPathData?.length &&
    !step.branchingQuestion &&
    (!step.bodySlate || isEmptyBody(step.bodySlate)) &&
    hasOnlyDefaultCtas(step.ctas, step.stepType, guideFormFactor, theme)
  );
};
