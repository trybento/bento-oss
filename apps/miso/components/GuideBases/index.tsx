import React from 'react';
import { graphql } from 'react-relay';
import QueryRenderer from 'components/QueryRenderer';
import EditUserGuideBase from 'components/UserGuideBases/EditUserGuideBase';
import EditAccountGuideBase from 'components/AccountGuideBases/EditAccountGuideBase';
import UsersProvider from 'providers/UsersProvider';
import useToast from 'hooks/useToast';
import { useRouter } from 'next/router';
import { GuideTypeEnum } from 'bento-common/types';
import { GuideBasesQuery } from 'relay-types/GuideBasesQuery.graphql';

interface ContainerProps {
  guideBaseEntityId: string;
}

type GuideBasesQueryResponse = GuideBasesQuery['response'];

interface Props extends GuideBasesQueryResponse {}

const GuideBase: React.FC<Props> = ({ guideBase }) => {
  const toast = useToast();
  const router = useRouter();

  if (guideBase === null) {
    toast({
      title: 'Guide not found!',
      isClosable: true,
      status: 'error',
    });

    router.push(`/customers`);
    return null;
  }

  const { entityId, type } = guideBase;

  // There shouldn't be guide-bases of type 'template'.
  return type === GuideTypeEnum.account ? (
    <UsersProvider>
      <EditAccountGuideBase guideBaseEntityId={entityId} />
    </UsersProvider>
  ) : (
    <EditUserGuideBase guideBaseEntityId={entityId} />
  );
};

const GUIDE_BASE_QUERY = graphql`
  query GuideBasesQuery($entityId: EntityId!) {
    guideBase: findGuideBase(entityId: $entityId) {
      entityId
      type
    }
  }
`;

export default function GuideBasesQueryRenderer(cProps: ContainerProps) {
  const { guideBaseEntityId } = cProps;
  if (!guideBaseEntityId) return null;

  return (
    <QueryRenderer<GuideBasesQuery>
      query={GUIDE_BASE_QUERY}
      variables={{
        entityId: guideBaseEntityId,
      }}
      render={({ props }) => {
        if (props) {
          return <GuideBase {...props} />;
        }
      }}
    />
  );
}
