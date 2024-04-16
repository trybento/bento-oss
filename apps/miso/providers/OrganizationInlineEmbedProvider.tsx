import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import OrgInlineEmbedsQuery from 'queries/OrgInlineEmbedsQuery';
import { OrgInlineEmbedsQuery as OrgInlineEmbedsQueryType } from 'relay-types/OrgInlineEmbedsQuery.graphql';
import { useOrganization } from './LoggedInUserProvider';
import { useSubscription } from 'react-relay';
import { GraphQLSubscriptionConfig, OperationType } from 'relay-runtime';
import { InlineEmbedsChangedSubscription } from 'relay-types/InlineEmbedsChangedSubscription.graphql';
import onboardingInlineEmbedsChangedSubscription from 'subscriptions/OnboardingInlineEmbedsChanged';
import DeleteInlineEmbedMutation from 'mutations/DeleteInlineEmbed';
import EditInlineEmbedMutation from 'mutations/EditInlineEmbed';
import { EditOrganizationInlineEmbedInput } from 'relay-types/EditInlineEmbedMutation.graphql';
import { WysiwygEditorAction } from 'components/WysiwygEditor/utils';
import { useVisualBuilder } from './VisualBuilderProvider';
import {
  VisualBuilderSessionType,
  WysiwygEditorMode,
} from 'bento-common/types';
import CreateInlineEmbedMutation from 'mutations/CreateInlineEmbed';
import useToast from 'hooks/useToast';
import { TemplateValue } from 'bento-common/types/templateData';

type InlineEmbed = OrgInlineEmbedsQueryType['response']['inlineEmbeds'][number];

interface Context {
  loading: boolean;
  inlineEmbed: InlineEmbed | undefined;
  updateInlineEmbed: (args: EditOrganizationInlineEmbedInput) => Promise<void>;
  deleteInlineEmbed: () => Promise<void>;
  handleEditOrCreateOrganizationInlineEmbed: (
    templateData: TemplateValue,
    initialMode?: WysiwygEditorMode
  ) => Promise<void>;
}

const OrganizationInlineEmbedContext = createContext<Context>(null);

export const useOrganizationInlineEmbed = () => {
  const context = useContext(OrganizationInlineEmbedContext);

  return context;
};

const OrganizationInlineEmbedProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [inlineEmbed, setInlineEmbed] = useState<InlineEmbed | undefined>();
  const { organization } = useOrganization();
  const { launchVisualBuilderSession } = useVisualBuilder();
  const toast = useToast();

  const fetchInlineEmbed = useCallback(async () => {
    try {
      setLoading(true);

      const res = await OrgInlineEmbedsQuery({
        fetchPolicy: 'network-only',
        variables: { entityId: organization.entityId },
      });

      const embed = res.inlineEmbeds[0];

      setInlineEmbed(embed);
    } finally {
      setLoading(false);
    }
  }, [organization]);

  useEffect(() => {
    fetchInlineEmbed();
  }, [organization]);

  useSubscription(
    useMemo<GraphQLSubscriptionConfig<OperationType>>(
      () => ({
        subscription: onboardingInlineEmbedsChangedSubscription,
        variables: {},
        onNext: (data: InlineEmbedsChangedSubscription['response']) =>
          setInlineEmbed(data.inlineEmbeds[0] as any),
      }),
      []
    )
  );

  const updateInlineEmbed = useCallback(
    async (args: EditOrganizationInlineEmbedInput) => {
      await EditInlineEmbedMutation(args);

      fetchInlineEmbed();
    },
    []
  );

  const deleteInlineEmbed = useCallback(async () => {
    await DeleteInlineEmbedMutation({ entityId: inlineEmbed?.entityId });

    fetchInlineEmbed();
  }, [inlineEmbed?.entityId]);

  const handleEditOrCreateOrganizationInlineEmbed = useCallback(
    async (templateData: TemplateValue, initialMode?: WysiwygEditorMode) => {
      const mode =
        initialMode ||
        (inlineEmbed ? WysiwygEditorMode.preview : WysiwygEditorMode.customize);

      const action = inlineEmbed
        ? WysiwygEditorAction.edit
        : WysiwygEditorAction.create;

      const progressData = await launchVisualBuilderSession({
        type: VisualBuilderSessionType.Inline,
        baseUrl: `/inline-injection/${action}`,
        initialData: {
          templateData,
          inlineEmbed,
          mode,
        },
      });

      if (progressData) {
        const {
          data: {
            inlineEmbed: {
              entityId,
              position,
              topMargin,
              rightMargin,
              bottomMargin,
              padding,
              borderRadius,
              leftMargin,
              alignment,
              maxWidth,
            },
          },
          elementSelector,
          url,
          wildcardUrl,
        } = progressData;

        const commonMutationArgs = {
          elementSelector,
          url,
          wildcardUrl,
          position,
          topMargin,
          rightMargin,
          bottomMargin,
          padding,
          borderRadius,
          leftMargin,
          alignment,
          maxWidth,
        };

        if (entityId) {
          await EditInlineEmbedMutation({
            ...commonMutationArgs,
            entityId,
          });
        } else {
          await CreateInlineEmbedMutation({
            inlineEmbed: commonMutationArgs,
          });
        }

        toast({ status: 'success', title: 'Location updated' });
      }

      fetchInlineEmbed();
    },
    [inlineEmbed]
  );

  return (
    <OrganizationInlineEmbedContext.Provider
      value={{
        loading,
        inlineEmbed,
        updateInlineEmbed,
        deleteInlineEmbed,
        handleEditOrCreateOrganizationInlineEmbed,
      }}
    >
      {children}
    </OrganizationInlineEmbedContext.Provider>
  );
};

export default OrganizationInlineEmbedProvider;
