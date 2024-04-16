import { AllModulesQuery as AllModulesQueryType } from 'relay-types/AllModulesQuery.graphql';
import AllModulesQuery from 'queries/AllModulesQuery';
import { Theme } from 'bento-common/types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AllModulesProviderProps {
  children: any;
  /** Template or Organization theme. */
  theme?: Theme;
}

interface AllModulesProviderContextValue {
  modules: AllModulesQueryType['response']['modules'];
  fetchAllModules: () => Promise<void>;
  isLoading: boolean;
}

const AllModulesProviderContext = createContext<AllModulesProviderContextValue>(
  {
    modules: [],
    fetchAllModules: async () => {},
    isLoading: false,
  }
);

export const useAllModules = () => {
  return useContext(AllModulesProviderContext);
};

const AllModulesProvider = ({ children }: AllModulesProviderProps) => {
  const [modules, setModules] = useState<
    AllModulesQueryType['response']['modules']
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllModules = useCallback(async () => {
    setIsLoading(true);
    const response = await AllModulesQuery();
    setIsLoading(false);
    setModules(response?.modules || []);
  }, []);

  // Init modules.
  useEffect(() => {
    fetchAllModules();
  }, []);

  return (
    <AllModulesProviderContext.Provider
      value={{
        modules,
        fetchAllModules,
        isLoading,
      }}
    >
      {children}
    </AllModulesProviderContext.Provider>
  );
};

export default AllModulesProvider;
