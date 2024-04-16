import React from 'react';
import EditTag from 'components/Tags/EditTag';
import WysiwygErrorPage, {
  WysiwygError,
} from 'components/WysiwygEditor/WysiwygErrorPage';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import VisualBuilderSessionQuery from 'queries/VisualBuilderSessionQuery';
import { useRouter } from 'next/router';
import { OrgState } from 'bento-common/types';

const EditTagPage: React.FC<{ visualBuilderSessionEntityId: string }> = ({
  visualBuilderSessionEntityId,
}) => {
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

  const { templateData, stepPrototype, mode } =
    data.visualBuilderSession.initialData;

  return (
    <EditTag
      visualBuilderSessionEntityId={visualBuilderSessionEntityId}
      templateData={templateData}
      stepPrototype={stepPrototype}
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
    <EditTagPage
      visualBuilderSessionEntityId={router.query.sessionEntityId as string}
    />
  );
};

export default Wrapper;
