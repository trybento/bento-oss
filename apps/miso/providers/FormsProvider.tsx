import useCallbackRef from 'bento-common/hooks/useCallbackRef';
import { FormEntityType } from 'components/GuideForm/types';
import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export interface RootFormDetails {
  formEntityType: FormEntityType;
  entityId: string;
}

export interface TrackedForm {
  ranking: number;
  dirty: boolean;
  submitForm: any;
  isValid?: boolean;
  confirmed?: boolean;
  errors?: Record<string, string>;
  resetForm?: () => void;
}

interface TrackedForms {
  [formKey: string]: TrackedForm;
}

interface FormsProviderProps {
  rootFormDetails: RootFormDetails | null;
  formRankings: { [formKey: string]: number };
  refetch?: () => void;
  children: any;
}

interface FormInputValue {
  formKey: string;
  dirty: boolean;
  submitForm: any;
  confirmed?: boolean;
  isValid?: boolean;
  errors?: Record<string, any>;
  resetForm?: () => void;
}

interface FormsProviderContextValue {
  forms: TrackedForms;
  setForms: (forms: FormInputValue[]) => void;
  /** Updates form dirty state without resetting all references */
  updateFormDirty: (formKey: string, dirty: boolean) => void;
  submitForms: () => Promise<void>;
  setFormConfirmed: (formKey: string, newSubmitHandler?: any) => void;
  isAnyFormDirty: boolean;
  isAnyFormInvalid: boolean;
  /** Mostly used for analytics, pass null there is no need for that */
  rootFormDetails: RootFormDetails | null;
  lastError?: string;
  /** Store for items persisting across renders */
  persistedValues: Record<string, any>;
  setPersistedValues: (v: Record<string, any>) => void;
  resetForms: () => void;
  refetch?: () => void;
}

const FormsProviderContext = createContext<FormsProviderContextValue>({
  forms: {},
  setForms: (_f) => {},
  updateFormDirty: (_k, _d) => {},
  submitForms: async () => {},
  setFormConfirmed: (_f, _n) => {},
  isAnyFormDirty: false,
  isAnyFormInvalid: false,
  rootFormDetails: null,
  persistedValues: {},
  setPersistedValues: (_v) => {},
  resetForms: () => {},
  refetch: () => {},
});

export function useFormsProvider() {
  return useContext(FormsProviderContext);
}

/**
 * Tracks state of a number of child forms. Attempts to
 *   reconcile dirty states and changes across them, to be
 *   able to submit and reset as one unified form.
 *
 * Child forms need to call setForms to update the provider with
 *   its current state for accurate tracking.
 *
 * This was created to consolidate a number of different forms without
 *   actually consolidating them, so the long term goal is to eventually
 *   not require adding this extra layer.
 */
const FormsProvider: FC<FormsProviderProps> = ({
  children,
  formRankings,
  rootFormDetails,
  refetch,
}) => {
  const [isAnyFormInvalid, setIsAnyFormInvalid] = useState<boolean>(false);
  const [isAnyFormDirty, setIsAnyFormDirty] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string>(null);
  const forms = useRef<TrackedForms>({});
  const [persistedValues, setPersistedValues] = useState();

  const resetForms = useCallback(() => {
    setIsAnyFormDirty(false);
    for (const [_key, form] of Object.entries(forms.current)) {
      form.resetForm?.();
    }
  }, []);

  /**
   * Instead of hard setting T/F, use the individual forms' states as source of truth
   */
  const refreshDirtyState = useCallback(() => {
    setIsAnyFormDirty(Object.values(forms.current).some((f) => f.dirty));
  }, []);

  const updateFormDirty = useCallback((formKey: string, dirty: boolean) => {
    if (!forms.current[formKey]) return;

    forms.current[formKey] = {
      ...forms.current[formKey],
      dirty,
    };

    refreshDirtyState();
  }, []);

  const setForms = useCallback(
    (newForms: FormInputValue[]) => {
      newForms.forEach(
        ({
          formKey,
          dirty,
          submitForm,
          isValid,
          confirmed,
          errors,
          resetForm,
        }) => {
          forms.current[formKey] = {
            ranking: formRankings[formKey],
            dirty,
            submitForm,
            isValid,
            confirmed,
            errors,
            resetForm,
          };
        }
      );

      refreshDirtyState();

      const hasInvalidForm = Object.values(forms.current).some((f) => {
        const errored = f.isValid === false;

        if (errored && !lastError && f.errors) {
          const firstKey = Object.keys(f.errors)?.[0];
          setLastError(f.errors[firstKey]);
        }
        return errored;
      });

      setIsAnyFormInvalid(hasInvalidForm);

      if (!hasInvalidForm && lastError) setLastError(null);
    },
    [lastError, formRankings]
  );

  const isSubmitInProgress = useRef<boolean>(false);

  const submitForms = useCallbackRef(async () => {
    if (isAnyFormInvalid) return;
    isSubmitInProgress.current = true;

    // Stop remaining submits if something needs confirmation.
    let waitConfirmation = false;
    for (const [_key, form] of Object.entries(forms.current).sort(
      ([, f], [, f2]) => f.ranking - f2.ranking
    )) {
      // Skip forms without changes.
      if (!form.dirty) continue;

      // When confirming a form upon submission the submit fn is sometimes
      // updated to a new one that bypasses the confirmation checks. In those
      // cases, this will continue to loop until the submit fn is the same
      // between 2 loops to finish off the submission for this form before
      // moving on to the next one.
      //
      // TODO: this should be updated to instead have separate confirm and
      // submit functions so the logic is more explicit.
      let submit = undefined;
      while (submit !== form.submitForm) {
        submit = form.submitForm;
        await submit();
        if (form.confirmed === false) {
          waitConfirmation = true;
          break;
        }
      }
    }

    !waitConfirmation && refetch?.();
    isSubmitInProgress.current = false;

    refreshDirtyState();
  }, [isAnyFormInvalid, refetch]);

  const setFormConfirmed = useCallback((formKey, newSubmitHandler = null) => {
    if (forms.current[formKey]?.confirmed === false) {
      forms.current[formKey].confirmed = true;
      if (newSubmitHandler)
        forms.current[formKey].submitForm = newSubmitHandler;
    }
    if (!isSubmitInProgress.current) {
      // Resume pending forms.
      submitForms();
    }
  }, []);

  return (
    <FormsProviderContext.Provider
      value={{
        forms: forms.current,
        setForms,
        updateFormDirty,
        isAnyFormDirty,
        isAnyFormInvalid,
        submitForms,
        setFormConfirmed,
        rootFormDetails,
        lastError,
        persistedValues,
        setPersistedValues,
        resetForms,
        refetch,
      }}
    >
      {children}
    </FormsProviderContext.Provider>
  );
};

export default FormsProvider;
