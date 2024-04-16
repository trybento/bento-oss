import actionsFactory from 'components/Nps/actions';
import set from 'lodash/set';
import { NpsFormValue } from 'types';

export const getMockedActionsFactory = (mockedValues: NpsFormValue) => {
  const mockedSetFieldValue = (field: string, value: any) => {
    set(mockedValues, field, value);
  };
  actionsFactory(mockedSetFieldValue);
};
