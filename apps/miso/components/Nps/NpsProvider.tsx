import React, { createContext, useContext, useMemo, FC } from 'react';
import { useFormikContext } from 'formik';
import { LaunchOrPauseNpsSurveyResponse, NpsFormValue } from 'types';
import actionsFactory, {
  defaultNpsActions,
  launchOrPauseSurvey,
  NpsActions,
} from './actions';
import { defaultValues } from './constants';
import { FormEntityLabel } from 'components/GuideForm/types';

type NpsProviderProps = {
  children: any;
  refetch: () => Promise<void>;
};

export type NpsProviderContextValue = {
  saveChanges: () => Promise<void>;
  isValid: boolean;
  launchOrPause: () => Promise<LaunchOrPauseNpsSurveyResponse>;
  dirty: boolean;
  refetch: () => Promise<void>;
} & Pick<NpsFormValue, 'priorityRankings'> &
  NpsFormValue['npsSurveyData'] &
  NpsActions;

const NpsProviderContext = createContext<NpsProviderContextValue>({
  ...defaultNpsActions,
  ...defaultValues,
  priorityRankings: {
    formEntityLabel: FormEntityLabel.nps,
    currentTarget: undefined,
    autoLaunchableTargets: [],
  },
  launchOrPause: async () => {
    return {} as LaunchOrPauseNpsSurveyResponse;
  },
  isValid: true,
  dirty: false,
  saveChanges: async () => {},
  refetch: async () => {},
});

export function useNpsProvider() {
  return useContext(NpsProviderContext);
}

const NpsProvider: FC<NpsProviderProps> = ({ children, refetch }) => {
  const { values, setFieldValue, submitForm, isValid, dirty } =
    useFormikContext<NpsFormValue>();

  const actions = useMemo(() => actionsFactory(setFieldValue), []);

  const contextValue = useMemo(
    () => ({
      refetch,
      isValid,
      dirty,
      saveChanges: submitForm,
      priorityRankings: values.priorityRankings,
      launchOrPause: async () => {
        return await launchOrPauseSurvey(values);
      },
      ...values.npsSurveyData,
      ...actions,
    }),
    [refetch, values, isValid, dirty, actions]
  );

  return (
    <NpsProviderContext.Provider value={contextValue}>
      {children}
    </NpsProviderContext.Provider>
  );
};

export default NpsProvider;
