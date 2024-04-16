import React, { useMemo } from 'react';
import { Box } from '@chakra-ui/layout';
import { ColumnDef } from '@tanstack/react-table';

import DataTable from 'components/DataTable';
import { AudienceQuery$data } from 'relay-types/AudienceQuery.graphql';
import { GuideComponentColumn, NameColumn } from 'components/DataTable/columns';
import { useInternalGuideNames } from 'hooks/useFeatureFlag';

type AudienceTemplate = AudienceQuery$data['audience']['templates'][number];

type Props = {
  templateData: readonly AudienceTemplate[];
};

export default function AudienceTemplatesTable({ templateData }: Props) {
  const enabledInternalNames = useInternalGuideNames();

  const columns = useMemo<ColumnDef<AudienceTemplate>[]>(
    () => [
      NameColumn<AudienceTemplate>({
        enabledInternalNames,
        useLink: true,
        openInNew: true,
      }),
      GuideComponentColumn<AudienceTemplate>(),
    ],
    [templateData]
  );

  return (
    <Box w="full">
      <DataTable<AudienceTemplate>
        columns={columns}
        data={templateData as AudienceTemplate[]}
        emptyState={{ text: 'No guides are using this saved audience yet' }}
        useAutoSort
      />
    </Box>
  );
}
