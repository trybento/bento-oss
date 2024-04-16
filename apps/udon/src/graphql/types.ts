import { Logger } from 'src/utils/logger';
import { Loaders } from 'src/data/loaders';
import { User } from 'src/data/models/User.model';
import { Organization } from 'src/data/models/Organization.model';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import { IdentifiableRequest } from 'src/middlewares/requestId';

export type AdminRequestUser = {
  user: User;
  organization: Organization;
};

export type EmbedRequestUser = {
  account: Account;
  accountUser: AccountUser;
  organization: Organization;
};

export type VisualBuilderRequestUser = {
  user: User;
  organization: Organization;
};

export interface AuthenticatedRequest extends Request, IdentifiableRequest {
  user: AdminRequestUser;
}

export interface AuthenticatedEmbedRequest
  extends Request,
    IdentifiableRequest {
  user: EmbedRequestUser;
}

export interface AuthenticatedVisualBuilderRequest
  extends Request,
    IdentifiableRequest {
  user: VisualBuilderRequestUser;
}

type CommonContextData = {
  loaders: Loaders;
  logger: Logger;
  /**
   * Whether "gated guide/step propagation" FF is enabled
   **/
  gatedGuideAndStepPropagation: boolean;
};

export interface GraphQLContext extends AdminRequestUser, CommonContextData {}

export interface EmbedContext extends EmbedRequestUser, CommonContextData {
  /** Bento initialization Id */
  bentoInitId?: string;
}

export interface VisualBuilderContext
  extends VisualBuilderRequestUser,
    CommonContextData {}
