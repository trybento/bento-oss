/** Used to construct Courier info */
type BatchedAlert<T> = {
  recipientEmail: string;
  recipientEntityId: string;
  bodyData: T;
  organizationId: number;
};

export type GroupedDict<T> = { [email: string]: BatchedAlert<T>[] };

export type EmailInfo = {
  [email: string]: {
    recipient: {
      recipientEmail: string;
      recipientEntityId: string;
      organizationId: number;
    };
    alerts: {
      accountName?: string;
      stepName: string;
      guideName: string;
      linkUrl: string;
    }[];
  };
};
