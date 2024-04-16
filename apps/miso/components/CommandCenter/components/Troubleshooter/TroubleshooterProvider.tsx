import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ContentSelection,
  shouldCheckLocation,
} from './TroubleshooterModules/troubleshoot.helpers';
import TroubleshootTemplateSelectedQuery from './queries/TroubleshootTemplateSelectedQuery';
import { TroubleshootTemplateSelectedQuery$data } from 'relay-types/TroubleshootTemplateSelectedQuery.graphql';
import { AccountSelection, AccountUserSelection } from './CustomerEntitySelect';
import { RequestIdHelper, useRequestId } from 'hooks/useRequestId';

export enum CheckStep {
  /** Global checks */
  initial = 'initial',
  /** Initial "easy" checks global on the template */
  templateState = 'templateState',
  /** Deeper debugging on targeting rules */
  targeting = 'targeting',
  /** Page targeting */
  location = 'location',
  /** URL mismatches, obsolete guides, or client-based errors */
  other = 'other',
}

/**
 * Shared states for troubleshooting content problems.
 * Focused on debugging users (not) getting content
 */
interface TroubleshooterContextValue {
  /** Template selected for debugging */
  contentSelection: ContentSelection;
  /** Additional info on a selected guide which we ask for when selected */
  contentDetails: ContentDetail;
  /** Account that we are debugging. Name + entityId */
  account: AccountSelection;
  /** Account user we are debugging. Name + entityId */
  accountUser: AccountUserSelection;
  requestId: RequestIdHelper;
  setAccount: (selection: AccountSelection) => void;
  setAccountUser: (selection: AccountUserSelection) => void;
  setContentSelection: (content: ContentSelection) => void;
  /** Nav */
  step: CheckStep;
  handleNext: () => void;
  handleBack: () => void;
  /** Reset out of this module */
  onReset: () => void;
}

const TroubleshooterContext = createContext<TroubleshooterContextValue>({
  contentDetails: null,
  contentSelection: null,
  account: null,
  accountUser: null,
  setAccount: (_) => {},
  setAccountUser: (_) => {},
  setContentSelection: (_) => {},
  requestId: null,
  step: CheckStep.initial,
  handleNext: () => {},
  handleBack: () => {},
  onReset: () => {},
});

export function useTroubleshooterContext() {
  return useContext(TroubleshooterContext);
}

type Props = {
  /** Handle reset out of the module */
  onReset: () => void;
};

type ContentDetail = TroubleshootTemplateSelectedQuery$data['template'];

/**
 * Store selections so we can display previous properties
 */
const TroubleshooterProvider: React.FC<React.PropsWithChildren<Props>> = ({
  onReset,
  children,
}) => {
  const [contentSelection, setContentSelection] =
    useState<ContentSelection>(null);
  const [contentDetails, setContentDetails] = useState<ContentDetail>(null);
  const [account, setAccount] = useState<AccountSelection>(null);
  const [accountUser, setAccountUser] = useState<AccountUserSelection>(null);
  const [stepNo, setStepNo] = useState<number>(0);
  const requestId = useRequestId();

  const stepOrders: CheckStep[] = useMemo(() => {
    return [
      CheckStep.initial,
      CheckStep.templateState,
      CheckStep.targeting,
      ...(contentDetails && shouldCheckLocation(contentDetails)
        ? [CheckStep.location]
        : []),
      CheckStep.other,
    ];
  }, [contentDetails]);

  const handleNext = useCallback(() => {
    if (stepNo + 1 === stepOrders.length) return;
    setStepNo(stepNo + 1);
  }, [stepNo, stepOrders]);

  const handleBack = useCallback(() => {
    if (stepNo - 1 < 0) return;
    setStepNo(stepNo - 1);
  }, [stepNo]);

  const fetchContentDetails = useCallback(async () => {
    if (contentSelection?.contentType === 'guide') {
      const content = await TroubleshootTemplateSelectedQuery({
        variables: {
          templateEntityId: contentSelection.entityId,
        },
      });

      if (!content) return;

      setContentDetails(content.template);
    } else {
      setContentDetails(null);
    }
  }, [contentSelection]);

  useEffect(() => {
    void fetchContentDetails();
  }, [contentSelection]);

  const step = stepOrders[stepNo];

  return (
    <TroubleshooterContext.Provider
      value={{
        contentDetails,
        requestId,
        contentSelection,
        setContentSelection,
        account,
        setAccount,
        accountUser,
        setAccountUser,
        step,
        handleNext,
        handleBack,
        onReset,
      }}
    >
      {children}
    </TroubleshooterContext.Provider>
  );
};

export default TroubleshooterProvider;
