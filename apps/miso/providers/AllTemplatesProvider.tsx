import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { AllTemplatesQuery as AllTemplatesQueryType } from 'relay-types/AllTemplatesQuery.graphql';
import AllTemplatesQuery from 'queries/AllTemplatesQuery';
import { isTemplateEligible } from 'components/Branching/helpers';
interface AllTemplatesProviderProps {
  children: any;
  disabled?: boolean;
}

interface AllTemplatesProviderContextValue {
  templates: AllTemplatesQueryType['response']['templates'];
  /** Templates that can be used for branching */
  reusableTemplates: AllTemplatesQueryType['response']['templates'];
  fetchAllTemplates: () => Promise<void>;
  isLoading: boolean;
}

const AllTemplatesProviderContext =
  createContext<AllTemplatesProviderContextValue>({
    templates: [],
    reusableTemplates: [],
    fetchAllTemplates: async () => {},
    isLoading: false,
  });

export const useAllTemplates = () => {
  return useContext(AllTemplatesProviderContext);
};

const AllTemplatesProvider = ({
  children,
  disabled,
}: AllTemplatesProviderProps) => {
  const [templates, setTemplates] = useState<
    AllTemplatesQueryType['response']['templates']
  >([]);
  const [reusableTemplates, setReusableTemplates] = useState<
    AllTemplatesQueryType['response']['templates']
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllTemplates = useCallback(async () => {
    setIsLoading(true);
    const response = await AllTemplatesQuery();
    const newTemplates = response?.templates || [];
    setIsLoading(false);
    setTemplates(newTemplates);
    setReusableTemplates(newTemplates.filter((t) => isTemplateEligible(t)));
  }, []);

  // Init templates.
  useEffect(() => {
    !disabled && fetchAllTemplates();
  }, [disabled]);

  return (
    <AllTemplatesProviderContext.Provider
      value={{
        templates,
        reusableTemplates,
        fetchAllTemplates,
        isLoading,
      }}
    >
      {children}
    </AllTemplatesProviderContext.Provider>
  );
};

export default AllTemplatesProvider;
