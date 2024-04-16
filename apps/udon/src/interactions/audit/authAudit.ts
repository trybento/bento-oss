import { Model } from 'sequelize';
import { UserStatus } from 'src/data/models/types';
import { User } from 'src/data/models/User.model';
import { logger } from 'src/utils/logger';

type Result =
  | {
      id: number;
      entityId: string;
      email: string;
      isSuperAdmin: boolean;
      organizationId: number;
      status: UserStatus;
    }
  | {};

export const extractDetailsToAudit = (auditable: User): Result => {
  if (auditable instanceof User) {
    return {
      id: auditable.id,
      entityId: auditable.entityId,
      email: auditable.email,
      isSuperAdmin: auditable.isSuperadmin,
      organizationId: auditable.organizationId,
      status: auditable.status,
    };
  }

  logger.warn(
    `[extractDetailsToAudit] Missing implementation to extract details of '${
      (auditable as Model)._model.sequelize.model.name
    }'`
  );
  return {};
};
