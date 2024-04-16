import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  UseToastOptions,
} from '@chakra-ui/react';
import useToast from 'hooks/useToast';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import GuideResetToastQuery from 'queries/GuideResetToastQuery';
import { ResetLevelEnumType } from 'relay-types/GuideResetToastQuery.graphql';

const GUIDE_RESET_TOAST_ID = 'guide-reset-toast';
const REFRESH_INTERVAL = 5_000; // 5s
const SUCCESS_TOAST_DURATION = 5_000; // 5s

const DEFAULT_PROPS: UseToastOptions = {
  duration: null,
  status: 'loading',
  variant: 'notice',
  title: 'Guide reset in progress',
  description: "Please don't navigate away or close this page",
};

const SUCCESS_PROPS: UseToastOptions = {
  status: 'success',
  variant: 'solid',
  duration: SUCCESS_TOAST_DURATION,
  title: 'Guide reset complete',
  description: 'You can now interact with your guide(s)',
};

interface Context {
  trigger: (
    resetLevel: ResetLevelEnumType,
    templateEntityIds: string[]
  ) => Promise<void>;
  runAutoCheck: (
    resetLevel: ResetLevelEnumType,
    templateEntityIds: string[]
  ) => Promise<void>;
}

const GuideResetToastContext = createContext<Context>(null);

const GuideResetAlert: React.FC<UseToastOptions> = ({
  status,
  variant,
  title,
  description,
}) => (
  <Alert
    status={status}
    variant={variant}
    alignItems="flex-start"
    boxShadow="0px 0px 7px 0px #00000014, 0px 3px 5px 0px #0000001F;"
  >
    <AlertIcon />
    <Box>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Box>
  </Alert>
);

export const useGuideResetToast = () => {
  const { trigger, runAutoCheck } = useContext(GuideResetToastContext);

  return { trigger, runAutoCheck };
};

interface Props {
  children?: React.ReactNode;
}

export const GuideResetToastProvider: React.FC<Props> = ({ children }) => {
  const toast = useToast();
  const interval = useRef<number>();

  const openToast = useCallback(() => {
    if (!toast.isActive(GUIDE_RESET_TOAST_ID)) {
      toast({
        ...DEFAULT_PROPS,
        id: GUIDE_RESET_TOAST_ID,
        render: (props) => <GuideResetAlert {...props} />,
      });
    } else {
      toast.update(GUIDE_RESET_TOAST_ID, DEFAULT_PROPS);
    }
  }, []);

  const closeToast = useCallback((success?: boolean) => {
    if (toast.isActive(GUIDE_RESET_TOAST_ID)) {
      if (success) {
        toast.update(GUIDE_RESET_TOAST_ID, SUCCESS_PROPS);
      } else {
        toast.close(GUIDE_RESET_TOAST_ID);
      }
    }
  }, []);

  const areEntitiesResetting = useCallback(
    async (resetLevel: ResetLevelEnumType, entityIds: string[]) => {
      try {
        const result = await GuideResetToastQuery({ resetLevel, entityIds });

        return result.organization.areEntitiesResetting;
      } catch {
        return false;
      }
    },
    []
  );

  const trigger = useCallback(
    async (resetLevel: ResetLevelEnumType, templateEntityIds: string[]) => {
      try {
        openToast();

        const interval = setInterval(async () => {
          const resetting = await areEntitiesResetting(
            resetLevel,
            templateEntityIds
          );

          if (!resetting) {
            clearInterval(interval);
            closeToast(true);
          }
        }, REFRESH_INTERVAL);
      } catch {
        closeToast();
      }
    },
    []
  );

  const refresh = useCallback(
    async (resetLevel: ResetLevelEnumType, templateEntityIds: string[]) => {
      try {
        const resetting = await areEntitiesResetting(
          resetLevel,
          templateEntityIds
        );

        if (resetting) {
          openToast();
        } else {
          closeToast(true);
        }
      } catch {
        closeToast(true);
      }
    },
    []
  );

  const runAutoCheck = useCallback(
    async (resetLevel: ResetLevelEnumType, templateEntityIds: string[]) => {
      // Run immediately on first load
      refresh(resetLevel, templateEntityIds);

      // Then run on an interval
      interval.current = window.setInterval(
        () => refresh(resetLevel, templateEntityIds),
        REFRESH_INTERVAL
      );
    },
    [interval]
  );

  useEffect(() => {
    // Close the toast when navigating away from the page
    return () => {
      if (interval.current) {
        window.clearInterval(interval.current);
      }

      if (toast.isActive(GUIDE_RESET_TOAST_ID)) {
        toast.close(GUIDE_RESET_TOAST_ID);
      }
    };
  }, []);

  return (
    <GuideResetToastContext.Provider value={{ trigger, runAutoCheck }}>
      {children}
    </GuideResetToastContext.Provider>
  );
};
