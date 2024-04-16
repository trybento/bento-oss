import React from 'react';
import WysiwygErrorPage, {
  WysiwygError,
} from 'components/WysiwygEditor/WysiwygErrorPage';
import { BentoLoadingSpinner } from 'components/TableRenderer';
import { useQueryAsHook } from 'hooks/useQueryAsHook';
import VisualBuilderSessionQuery from 'queries/VisualBuilderSessionQuery';
import { useRouter } from 'next/router';
import EditAutocompleteElement from 'components/AutocompleteElementEditor/EditAutocompleteElement';
import { OrgState } from 'bento-common/types';

const EditAutocompleteElementPage: React.FC<{
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

  return (
    <EditAutocompleteElement
      visualBuilderSessionEntityId={visualBuilderSessionEntityId}
      autoCompleteInteraction={data.visualBuilderSession.initialData}
    />
  );
};

const Wrapper: React.FC = () => {
  const router = useRouter();

  if (!router.isReady) {
    return null;
  }

  return (
    <EditAutocompleteElementPage
      visualBuilderSessionEntityId={router.query.sessionEntityId as string}
    />
  );
};

export default Wrapper;
