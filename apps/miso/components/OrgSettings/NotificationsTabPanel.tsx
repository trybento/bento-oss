import React, { useCallback, useMemo, useState } from 'react';
import {
  Input,
  FormControl,
  FormHelperText,
  FormLabel,
  Button,
} from '@chakra-ui/react';
import EndUserNudge from 'bento-common/email_templates/EndUserNudge';

import Box from 'system/Box';
import Radio from 'system/Radio';
import RadioGroup from 'system/RadioGroup';

import EmailInput from './EmailInput';
import { TabPanelProps } from './types';
import { isAbsoluteUrl } from 'helpers';
import { useFormikContext } from 'formik';
import { useEndUserNudges } from 'hooks/useFeatureFlag';

type NotificationsTabPanelProps = TabPanelProps & {
  blockSaving: boolean;
  areCurrentFieldsValid: boolean;
};

export default function NotificationsTabPanel({
  debounceSetFieldValue,
  values,
  setFieldValue,
  blockSaving,
  areCurrentFieldsValid,
}: NotificationsTabPanelProps) {
  const { dirty, handleSubmit } = useFormikContext();
  const enableEndUserNudges = useEndUserNudges();

  const defaultUserNotificationURL = useMemo(
    () =>
      isAbsoluteUrl(values.defaultUserNotificationURL)
        ? values.defaultUserNotificationURL
        : `https://${values.defaultUserNotificationURL}`,
    [values.defaultUserNotificationURL]
  );

  return (
    <Box display="flex">
      <Box display="flex" flexDir="column" gridGap="8" pr="4" w="450px">
        <FormControl>
          <FormLabel>Subscribe to guide notifications</FormLabel>
          <RadioGroup
            defaultValue={'' + !!values?.sendEmailNotifications}
            onChange={(value) =>
              debounceSetFieldValue(
                setFieldValue,
                'sendEmailNotifications',
                value === 'true'
              )
            }
            alignment="horizontal"
          >
            <Radio value="true" label="On" />
            <Radio value="false" label="Off" />
          </RadioGroup>
          <FormHelperText>
            Guide owners will receive notifications when there is end-user guide
            activity.
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Default notifications email address(es)</FormLabel>
          <EmailInput
            placeholder="Email address(es)"
            defaultValue={values?.fallbackCommentsEmail || ''}
            onChange={(value) =>
              debounceSetFieldValue(
                setFieldValue,
                'fallbackCommentsEmail',
                value
              )
            }
          />
          <FormHelperText>
            For all guides without an owner, notifications enabled above will be
            sent to these email(s). Enter multiple separated by a comma.
          </FormHelperText>
        </FormControl>

        {enableEndUserNudges && (
          <FormControl>
            <FormLabel>Send end user nudges</FormLabel>
            <RadioGroup
              defaultValue={'' + !!values?.sendAccountUserNudges}
              onChange={(value) =>
                debounceSetFieldValue(
                  setFieldValue,
                  'sendAccountUserNudges',
                  value === 'true'
                )
              }
              alignment="horizontal"
            >
              <Radio value="true" label="On" />
              <Radio value="false" label="Off" />
            </RadioGroup>
            <FormHelperText>
              If a user has incomplete steps in their onboarding guide, Bento
              can send a 1-time email reminder on your behalf. This happens 7
              days after the user gets their onboarding guide.
            </FormHelperText>
          </FormControl>
        )}

        {values?.sendAccountUserNudges && (
          <FormControl>
            <FormLabel>App URL (required)</FormLabel>
            <Input
              placeholder="app.example.com/getting-started"
              defaultValue={values?.defaultUserNotificationURL || ''}
              onChange={(e) =>
                debounceSetFieldValue(
                  setFieldValue,
                  'defaultUserNotificationURL',
                  e.target.value
                )
              }
            />
            <FormHelperText>
              We will link to your app so the user can easily log back in. This
              should be a url that goes to your password-protected core app.
            </FormHelperText>
          </FormControl>
        )}
        <Box mt="4">
          <Button
            type="submit"
            onClick={handleSubmit as any}
            isLoading={blockSaving}
            isDisabled={!dirty || !areCurrentFieldsValid}
          >
            Save changes
          </Button>
        </Box>
      </Box>
      {values?.sendAccountUserNudges && (
        <Box
          flex="1"
          display="flex"
          flexDir="column"
          gap="8"
          ml="32"
          minW="700px"
          maxW="700px"
        >
          <Box display="flex" flexDir="column" fontSize="xs">
            <Box>
              Email Subject:{' '}
              <b>Can I help you complete your {values.orgName} onboarding?</b>
            </Box>
            <Box>
              From:{' '}
              <b>
                {values.orgName} via Bento {'<notifications@bentohq.co>'}
              </b>
            </Box>
          </Box>
          <EndUserNudge
            organizationName={values.orgName}
            moduleName="Setup AcmeCo"
            steps={[
              { name: '👋 Upload current templates', isComplete: true },
              {
                name: '💻 Try initiating a payment via API',
                isComplete: false,
              },
              { name: '🏗️ Set up your workflow', isComplete: false },
            ]}
            defaultUserNotificationURL={defaultUserNotificationURL}
          />
        </Box>
      )}
    </Box>
  );
}
