import { ImageProps } from '@chakra-ui/react';
import React from 'react';
import {
  EventHookTypeEnum,
  WebhookStateTypeEnum,
} from 'relay-types/OrgSettingsQuery.graphql';

export type IntegrationOption = {
  name: string;
  /** Action for setting up the integration */
  onClick: () => void;
  /** Action for stopping the integration */
  onCancel?: () => void;
  /** If exists, and important data tied to it */
  currentIntegration: {
    /** Null probably means not set-up */
    value: string;
    /** Aditional validation if necessary. Determines green check */
    check?: () => boolean;
  };
  logoUrl: string;
  logoStyling?: ImageProps;
  description: string;
  /** Label to begin integrating something not connected */
  startButtonLabel?: string;
  /** Label for cancelling */
  cancelButtonLabel?: string;
  /** Label for editing a connected integration */
  editButtonLabel?: string;
  /** Something to show on active integrations if there's additional actions */
  actionButton?: JSX.Element;
  CustomBody?: JSX.Element;
  calloutText?: React.ReactNode | string;
  /** FF off, ask for upgrade */
  disabled?: boolean;
};

export type WebhookOptions = {
  webhookUrl: string;
  secretKey?: string;
  state: WebhookStateTypeEnum;
  eventType: EventHookTypeEnum;
};

export enum EventHookState {
  Active = 'active',
  Inactive = 'inactive',
}

export enum WebhookType {
  All = 'all',
}
