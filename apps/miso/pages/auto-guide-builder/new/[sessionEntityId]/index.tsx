import React from 'react';
import WysiwygErrorPage, {
  WysiwygError,
} from 'components/WysiwygEditor/WysiwygErrorPage';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import VisualBuilderSessionQuery from 'queries/VisualBuilderSessionQuery';
import { useRouter } from 'next/router';
import NewAiGuide from 'components/AutoGuideBuilder/NewAiGuide';
import { OrgState } from 'bento-common/types';

const NewAutoGuideBuilderPage: React.FC<{
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

  const { templateEntityId } = data.visualBuilderSession.initialData;

  return (
    <NewAiGuide
      templateEntityId={templateEntityId}
      visualBuilderSessionEntityId={visualBuilderSessionEntityId}
    />
  );
};

const Wrapper: React.FC = () => {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  return (
    <NewAutoGuideBuilderPage
      visualBuilderSessionEntityId={router.query.sessionEntityId as string}
    />
  );
};

export default Wrapper;
