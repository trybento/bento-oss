import '.';

import { BentoSettings } from 'bento-common/types';

import { VisualBuilderSessionQuery } from '~src/graphql/queries/generated/VisualBuilderSession';

export type ExtensionSettings = {
  bentoSettings: BentoSettings;
};

export type ExtensionMessage =
  | {
      type: 'initialize';
      settings: ExtensionSettings;
    }
  | { type: 'reset' }
  | {
      type: 'session';
      session: Session;
    };

export type Session = {
  accessToken: string;
} & VisualBuilderSessionQuery;
