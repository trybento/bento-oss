import React from 'react';
import WysiwygErrorPage, {
  WysiwygError,
} from 'components/WysiwygEditor/WysiwygErrorPage';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import VisualBuilderSessionQuery from 'queries/VisualBuilderSessionQuery';
import { useRouter } from 'next/router';
import EditInlineInjection from 'components/InlineInjectionEditor/EditInlineInjection';
import { OrgState } from 'bento-common/types';

const EditInlineInjectionPage: React.FC<{
  visualBuilderSessionEntityId: string;
}> = ({ visualBuilderSessionEntityId }) => {
  const { data, loading } = useQueryAsHook(VisualBuilderSessionQuery, {
    visualBuilderSessionEntityId,
  });

  if (loading) {
    return <BentoLoadingSpinner h="100vh" />;
  }

  if (data.organization.state === OrgState.Inactive) {
    return <WysiwygErrorPage error={WysiwygError.inactiveOrg} />;
  }

  if (
    !data ||
    !data.visualBuilderSession ||
    !data.visualBuilderSession.initialData
  ) {
    return <WysiwygErrorPage />;
  }

  const { templateData, mode, inlineEmbed } =
    data.visualBuilderSession.initialData;

  return (
    <EditInlineInjection
      templateData={templateData}
      visualBuilderSessionEntityId={visualBuilderSessionEntityId}
      inlineEmbed={inlineEmbed || templateData.inlineEmbed}
      mode={mode}
    />
  );
};

const Wrapper: React.FC = () => {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  return (
    <EditInlineInjectionPage
      visualBuilderSessionEntityId={router.query.sessionEntityId as string}
    />
  );
};

export default Wrapper;
