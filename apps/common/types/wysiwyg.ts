/**
 * EXTENSION MESSAGING
 */

export enum WysiwygExtensionMessageType {
  CheckVersion = 'checkVersion',
}

export type WysiwygExtensionMessageConfig<
  T extends WysiwygExtensionMessageType,
  Payload = {},
  Res = unknown
> = {
  type: T;
  payload: Payload;
  response: Res;
};

export type CheckVersionMessage = WysiwygExtensionMessageConfig<
  WysiwygExtensionMessageType.CheckVersion,
  {},
  { version: string; debug?: boolean }
>;
