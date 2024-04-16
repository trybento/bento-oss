import { CustomApiEventsQuery as CustomApiEventsQueryType } from 'relay-types/CustomApiEventsQuery.graphql';
import CustomApiEventsQuery from 'queries/CustomApiEventsQuery';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CustomApiEventTypes } from 'types';

interface CustomApiEventsProviderProps {
  children: any;
}

export interface CreatedApiEvent {
  name: string;
  type: CustomApiEventTypes;
}

interface CustomApiEventsProviderContextValue {
  customApiEvents:
    | CustomApiEventsQueryType['response']['customApiEvents']
    | null;
  createdApiEvents: CreatedApiEvent[];
  fetchCustomApiEvents: () => Promise<void>;
  trackCreatedApiEvent: (name: string, type: CustomApiEventTypes) => void;
}

const CustomApiEventsProviderContext =
  createContext<CustomApiEventsProviderContextValue>({
    customApiEvents: [],
    createdApiEvents: [],
    fetchCustomApiEvents: async () => {},
    trackCreatedApiEvent: () => {},
  });

export const useCustomApiEvents = () => {
  return useContext(CustomApiEventsProviderContext);
};

const CustomApiEventsProvider = ({
  children,
}: CustomApiEventsProviderProps) => {
  const [customApiEvents, setCustomApiEvents] = useState<
    CustomApiEventsQueryType['response']['customApiEvents'] | null
  >(null);

  // Keep track of unsaved api events.
  const [createdApiEvents, setCreatedApiEvents] = useState<CreatedApiEvent[]>(
    []
  );

  const trackCreatedApiEvent = useCallback(
    (name: string, type: CustomApiEventTypes) => {
      !createdApiEvents.some((e) => e.name === name && e.type === type) &&
        setCreatedApiEvents([...createdApiEvents, { name, type }]);
    },
    [createdApiEvents]
  );

  const fetchCustomApiEvents = useCallback(async () => {
    const response = await CustomApiEventsQuery(true, true);
    setCustomApiEvents(response.customApiEvents || []);
  }, []);

  return (
    <CustomApiEventsProviderContext.Provider
      value={{
        customApiEvents,
        createdApiEvents,
        fetchCustomApiEvents,
        trackCreatedApiEvent,
      }}
    >
      {children}
    </CustomApiEventsProviderContext.Provider>
  );
};

export default CustomApiEventsProvider;
