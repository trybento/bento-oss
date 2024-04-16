import React, { ReactNode, useMemo, useState } from 'react';
import { BoxProps, Kbd, Link } from '@chakra-ui/react';
import {
  displayUrlToWildcardUrl,
  wildcardUrlToDisplayUrl,
} from 'bento-common/utils/wildcardUrlHelpers';
import useCallbackRef from 'bento-common/hooks/useCallbackRef';

import { isAbsoluteUrl } from 'helpers';
import DynamicAttributeInput, {
  DynamicAttributeInputContainerProps,
} from 'bento-common/components/ModalDynamicAttribute/DynamicAttributeInput';
import { WarningCallout } from 'bento-common/components/CalloutText';
import colors from 'helpers/colors';
import HelperText from 'system/HelperText';
import { useAttributes } from 'providers/AttributesProvider';
import { Attribute } from 'bento-common/types';

export type UrlInputProps = Pick<
  DynamicAttributeInputContainerProps,
  'disabled' | 'autoFocus' | 'fontSize' | 'onContentChange' | 'inputStyle'
> & {
  initialUrl: string;
  onEnter?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  withCallout?: boolean;
  warnOnRelativeUrls?: boolean;
  warnOnUrlWithWildcard?: boolean;
  allowWildcards?: boolean;
  helperText?: ReactNode;
  allowDynamicAttributes?: boolean;
  hideInitialContent?: boolean;
} & Omit<BoxProps, 'onChange'>;

/** Makes urls absolute */
export const getFixedUrl = (url: string) => {
  const _url = url || '';
  if (
    !isAbsoluteUrl(_url) &&
    _url?.[0] !== '/' &&
    _url.length > 0 &&
    !_url.startsWith('mailto:')
  ) {
    return `https://${_url}`;
  }
  return _url;
};

/**
 * Prevent people saving another https:// behind prepopulated https://
 * Note: doesn't work for https://http:// or vice versa
 */
const preventDuplicateHttps = (url: string) => {
  const count = (url.match(new RegExp('://', 'g')) || []).length;

  if (count > 1 && url.startsWith('https://')) {
    return url.replace('https://', '');
  }

  if (count > 1 && url.startsWith('http://')) {
    return url.replace('http://', '');
  }

  return url;
};

export const doUrlChecks = (url: string) =>
  preventDuplicateHttps(getFixedUrl(url));

export const hasInvalidWildcards = (url = '', allowWildcards = true) =>
  !allowWildcards && url?.includes('*');

export function UrlInputCallout({
  allowWildcards,
  allowDynamicAttributes,
  helperText,
  ...boxProps
}: Pick<
  UrlInputProps,
  'allowWildcards' | 'allowDynamicAttributes' | 'helperText'
> &
  BoxProps) {
  if (!allowDynamicAttributes && !allowWildcards && !helperText) return <></>;

  return (
    <HelperText {...boxProps}>
      {helperText ? (
        helperText
      ) : (
        <>
          {allowWildcards ? (
            <>
              We support RegEx, <Kbd>*</Kbd> for wildcards and <Kbd>{'{{'}</Kbd>{' '}
              for dynamic attributes.
            </>
          ) : (
            <>
              Use <Kbd>{'{{'}</Kbd> for dynamic attributes.
            </>
          )}{' '}
          <Link
            href="https://help.trybento.co/en/articles/5979053-dynamic-urls-content"
            target="_blank"
            color="bento.bright"
          >
            See more here.
          </Link>
        </>
      )}
    </HelperText>
  );
}

export default function UrlInput({
  initialUrl,
  onContentChange,
  onEnter,
  withCallout = true,
  warnOnRelativeUrls,
  allowWildcards = true,
  allowDynamicAttributes = true,
  helperText,
  warnOnUrlWithWildcard = true,
  hideInitialContent = false,
  ...otherDynamicAttrInputProps
}: UrlInputProps) {
  const { attributes } = useAttributes();
  const validate = useCallbackRef(
    (url: string) => !hasInvalidWildcards(url, allowWildcards),
    [allowWildcards]
  );
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [isValid, setIsValid] = useState<boolean>(validate(initialUrl));

  const showRelativeUrlWarning = useMemo(
    () => warnOnRelativeUrls && url && (!isAbsoluteUrl(url) || url[0] === '/'),
    [url, warnOnRelativeUrls]
  );

  const showWildcardWarning = useMemo(
    () => warnOnUrlWithWildcard && hasInvalidWildcards(url, allowWildcards),
    [allowWildcards, url, warnOnUrlWithWildcard]
  );

  const displayUrl = useMemo(
    () => (allowWildcards && url ? wildcardUrlToDisplayUrl(url) : url),
    [url]
  );

  const updateUrl = useCallbackRef(
    (newUrl: string) => {
      let fixedUrl = doUrlChecks(newUrl);
      const valid = validate(fixedUrl);
      fixedUrl = allowWildcards ? displayUrlToWildcardUrl(fixedUrl) : fixedUrl;
      setUrl(fixedUrl);
      setIsValid(valid);
      onContentChange(fixedUrl, valid);
    },
    [onContentChange, allowWildcards]
  );

  const onKeyDown = useCallbackRef(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && isValid) {
        onEnter?.();
      }
    },
    [onEnter, isValid]
  );

  return (
    <>
      <DynamicAttributeInput
        attributes={attributes as Attribute[]}
        initialValue={displayUrl || (hideInitialContent ? '' : 'http://')}
        onContentChange={updateUrl}
        validate={validate}
        onKeyDown={onKeyDown}
        mentionDisabled={!allowDynamicAttributes && !allowWildcards}
        {...otherDynamicAttrInputProps}
      />
      {withCallout && (
        <UrlInputCallout
          mt="2"
          allowWildcards={allowWildcards}
          helperText={helperText}
        />
      )}
      {showRelativeUrlWarning && (
        <WarningCallout mt="2" color={colors.warning.text} fontSize="xs">
          We recommend using absolute urls (i.e. https://www.acmeco.co) so that
          your links preview correctly
        </WarningCallout>
      )}
      {showWildcardWarning && (
        <WarningCallout mt="2" color={colors.warning.text} fontSize="xs">
          Wildcards (<Kbd>*</Kbd>) are not supported because there would be no
          way to know where to the take the user.
        </WarningCallout>
      )}
    </>
  );
}
