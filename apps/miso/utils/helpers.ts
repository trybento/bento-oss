import JSConfetti from 'js-confetti';

import { StepType } from 'bento-common/types';
import { ContextTagType } from 'bento-common/types/globalShoyuState';

import * as ModifyUserExtrasMutation from 'mutations/ModifyUserExtras';
import colors from 'helpers/colors';
import { FormEntityLabel } from 'components/GuideForm/types';
import { removeQueryFromUrl, removeUrlQueries } from 'helpers';
import { useMemo } from 'react';
import { SelectOptions } from 'system/Select';

export const UNKNOWN_USERNAME = 'Unidentified user';

export function isBranching(stepType: undefined | null | StepType) {
  return (
    stepType === StepType.branching || stepType === StepType.branchingOptional
  );
}

export const getFormEntityLabel = ({
  isSplitTest,
}: {
  isSplitTest?: boolean;
}): FormEntityLabel => {
  return isSplitTest ? FormEntityLabel.test : FormEntityLabel.guide;
};

export const isOptionalStep = (stepType: undefined | null | StepType) =>
  stepType === StepType.optional ||
  stepType === StepType.branchingOptional ||
  stepType === StepType.fyi;

export const accountUserNameIdentityShort = (accountUser: any) => {
  const fullNameArray = accountUser?.fullName?.split(' ');
  const firstName = fullNameArray?.[0];
  const lastNameInitial = fullNameArray?.[1]?.charAt(0) || '';
  const nameFormatted = firstName
    ? firstName + (lastNameInitial ? ' ' + lastNameInitial : '')
    : '';

  const identity =
    (nameFormatted || '').trim() ||
    (accountUser?.email || '').trim() ||
    UNKNOWN_USERNAME;

  return identity;
};

/** Check of we should burst confetti, burst, then stop it */
export const burstConfetti = async ({
  userEntityId,
  key,
  extra = {},
  confettiColors = [
    colors.bento.pale,
    colors.bento.medium,
    colors.bento.logo,
    colors.bento.bright,
    colors.bento.dark,
  ],
}: {
  userEntityId: string;
  key: string;
  extra: Record<string, any>;
  confettiColors?: string[];
}) => {
  const existing = sessionStorage.getItem(key);
  if (existing || extra?.[key]) return;

  const jsConfetti = new JSConfetti();

  jsConfetti
    .addConfetti({ confettiColors })
    .then(() => jsConfetti.clearCanvas());

  sessionStorage.setItem(key, 'true');
  await ModifyUserExtrasMutation.commit({ userEntityId, key });
};

export const accountUserNameIdentityLong = (accountUser: any): string => {
  const identity =
    (accountUser?.fullName || '').trim() ||
    (accountUser?.email || '').trim() ||
    UNKNOWN_USERNAME;

  return identity;
};

export const copyToClipboard = (str: string) => {
  if (!navigator.clipboard) {
    const textArea = document.createElement('textarea');

    document.body.appendChild(textArea);
    textArea.value = str;
    textArea.focus();
    textArea.select();
    document.execCommand('copy');

    document.body.removeChild(textArea);
  } else {
    navigator.clipboard.writeText(str);
  }
};

export const getTagTypeLabel = (type?: ContextTagType | null) => {
  if (!type) return type;

  switch (type) {
    case ContextTagType.dot:
    default:
      return 'Dot';

    case ContextTagType.badge:
      return 'Badge';

    case ContextTagType.badgeDot:
      return 'Badge Dot';

    case ContextTagType.icon:
      return 'Icon';

    case ContextTagType.badgeIcon:
      return 'Badge Icon';
  }
};

export const showErrors = (error, toastIntance) => {
  if (!error) return;

  let errors;
  if (Array.isArray(error)) {
    if (error?.[0]?.message) {
      errors = error.map((e) => e.message);
    } else {
      errors = error;
    }
  } else {
    if (Object.values(error)[0]) errors = [Object.values(error)[0]];
    else errors = ['Something went wrong'];
  }

  Object.values(errors).forEach((err) => {
    toastIntance({
      title: err,
      isClosable: true,
      status: 'error',
    });
  });
};

type RemoveType = 'all' | 'targeted';

export function getUrlQuery<T extends string>(
  q: T,
  remove?: RemoveType
): string | undefined;
export function getUrlQuery<T extends string>(
  q: T[],
  remove?: RemoveType
): Record<T, string | undefined>;
export function getUrlQuery<T extends string>(
  searchQuery: T[] | T,
  remove?: RemoveType
): Record<T, string | undefined> | (string | undefined) {
  const params = new URLSearchParams(window.location.search);

  if (!Array.isArray(searchQuery)) {
    const result = params.get(searchQuery);
    if (remove === 'all') removeUrlQueries();
    else if (remove === 'targeted') removeQueryFromUrl(searchQuery);
    return result;
  }

  /* handle array */
  const result = searchQuery.reduce((a, term) => {
    const val = params.get(term);
    if (val) a[term] = val;
    return a;
  }, {} as Record<T, string | undefined>);

  if (remove === 'all') removeUrlQueries();
  else if (remove === 'targeted') removeQueryFromUrl(searchQuery);

  return result;
}

/**
 * Find the selected option from a list of SelectOptions, so dropdowns render properly
 * @param opts Should be static so we don't have an object dependency
 */
export const useSelectedOption = <T>(opts: SelectOptions<T>[], opt: T) => {
  const res = useMemo(() => {
    return opts.find((o) => o.value === opt);
  }, [opt]);

  return res;
};

/**
 * Simple try-catch on an error to allow for easier exit clauses
 * @param cb
 * @param onError
 */
export const withErrorCatch = <T>(
  cb: () => T,
  onError?: (err: Error) => void
) => {
  try {
    return cb();
  } catch (e) {
    onError?.(e);
    return null;
  }
};
