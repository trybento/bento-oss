import React, { useCallback, useMemo, useRef, useState } from 'react';
import { graphql } from 'relay-runtime';
import { omit } from 'lodash';
import { Formik, Form } from 'formik';
import { Button } from '@chakra-ui/react';

import * as SetUISettings from 'mutations/SetUISettings';
import QueryRenderer from 'components/QueryRenderer';
import { ResourceCenterSettingsQuery } from 'relay-types/ResourceCenterSettingsQuery.graphql';
import AllGuidesSettings from 'components/ResourceCenterSettings/AllGuidesSettings';
import useToast from 'hooks/useToast';
import UnsavedChangesManager from 'components/UnsavedChangesManager';
import Page from 'components/layout/Page';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import ResourceCenterQuery from 'queries/ResourceCenterQuery';
import { BentoLoadingSpinner } from 'components/TableRenderer';

type Props = ResourceCenterSettingsQuery['response'] & {
  onRefetch?: () => void;
};

function ResourceCenterSettings({ onRefetch, uiSettings }: Props) {
  const toast = useToast();
  const validators = useRef<((v: object) => object)[]>([]);
  const [preventPageChange, setPreventPageChange] = useState(true);
  const { data: resourceCenter } = useQueryAsHook(ResourceCenterQuery, {});
  const { orgSettings, organization } = resourceCenter || {};

  const initialValues = useMemo(
    () => ({
      ...uiSettings,
      ...resourceCenter,
    }),
    [uiSettings, resourceCenter]
  );

  const validate = useCallback(
    (values) =>
      validators.current.length === 0
        ? {}
        : validators.current.reduce(
            (validation, validator) => ({
              ...validation,
              ...validator(values),
            }),
            {}
          ),
    []
  );

  const addValidator = useCallback((validator: (v: object) => object) => {
    validators.current.push(validator);
  }, []);

  const handleSave = useCallback(async (values) => {
    try {
      const sanitizedValues = omit(values, [
        'attributes',
        'organization',
        'orgSettings',
      ]);

      await SetUISettings.commit(sanitizedValues as any);

      toast({
        title: 'Saved!',
        status: 'success',
        isClosable: true,
      });

      onRefetch?.();
    } catch (e) {
      toast({
        title:
          e?.[0]?.message || 'There was a problem saving. Please try again.',
        status: 'error',
        isClosable: true,
      });
    }
  }, []);

  if (!orgSettings) return <BentoLoadingSpinner />;

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validate={validate}
      onSubmit={handleSave}
    >
      {({ dirty, isValid, handleSubmit, isSubmitting, submitForm }) => (
        <Page
          title="Resource center"
          actions={
            <Button
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!dirty || !isValid}
              onClick={submitForm}
            >
              Save
            </Button>
          }
        >
          <Form onSubmit={handleSubmit}>
            <AllGuidesSettings
              integrations={orgSettings.integrationApiKeys}
              addValidator={addValidator}
              organization={organization}
            />
          </Form>
          <UnsavedChangesManager
            warningEnabled={preventPageChange && dirty}
            onContinue={handleSubmit}
            onDiscard={() => setPreventPageChange(false)}
            exceptionUrlRegExp={/^\/styles\?anchor=[^&]+$/}
          />
        </Page>
      )}
    </Formik>
  );
}

const RESOURCE_CENTER_QUERY = graphql`
  query ResourceCenterSettingsQuery {
    uiSettings {
      ...UISettings_all @relay(mask: false)
    }
  }
`;

export default function ResourceCenterSettingsQueryRenderer() {
  return (
    <QueryRenderer<ResourceCenterSettingsQuery>
      query={RESOURCE_CENTER_QUERY}
      render={({ props, retry }) =>
        !props ? null : <ResourceCenterSettings {...props} onRefetch={retry} />
      }
    />
  );
}
