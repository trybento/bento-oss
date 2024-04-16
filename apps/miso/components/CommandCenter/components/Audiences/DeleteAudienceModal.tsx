import React from 'react';
import { ListItem, UnorderedList } from '@chakra-ui/layout';

import ConfirmDeleteModal from 'components/ConfirmDeleteModal';

type Props = {
  isOpen: boolean;
  onDelete: () => void;
  onClose: () => void;
  audienceName: string;
};

export default function DeleteAudienceModal({
  isOpen,
  onClose,
  onDelete,
  audienceName,
}: Props) {
  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onDelete={onDelete}
      onClose={onClose}
      header="Delete saved audience"
      entityName={audienceName}
      confirmButtomLabel="Delete"
    >
      <UnorderedList mt="4" ml="6">
        <ListItem>
          You will not be able to reuse this saved audience in your guides
        </ListItem>
        <ListItem>
          Live guides with this saved audience will be unaffected. They will
          switch to one-off rules, using a copy of the saved audience rules.
        </ListItem>
      </UnorderedList>
    </ConfirmDeleteModal>
  );
}
