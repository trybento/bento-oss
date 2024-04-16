import { v4 as uuidv4 } from 'uuid';

import { AuditEvent } from 'bento-common/types';
import { ModuleAudit } from 'src/data/models/Audit/ModuleAudit.model';
import { StepPrototypeAudit } from 'src/data/models/Audit/StepPrototypeAudit.model';
import { TemplateAudit } from 'src/data/models/Audit/TemplateAudit.model';
import detachPromise from './detachPromise';
import { AccountAudit } from 'src/data/models/Audit/AccountAudit.model';
import { GuideBaseAudit } from 'src/data/models/Audit/GuideBaseAudit.model';
import { excludedEvents } from 'src/graphql/Template/connections/templateFilter.helpers';
import { Template } from 'src/data/models/Template.model';

export enum AuditType {
  Template = 'template',
  Module = 'module',
  StepPrototype = 'stepPrototype',
  Account = 'account',
  GuideBase = 'guideBase',
}

const createDbEventLog = async ({
  type,
  modelId,
  data,
  isSystem,
}: {
  type: AuditType;
  modelId: number;
  data: {
    eventName: AuditEvent;
    userId?: number;
    organizationId: number;
    contextId: string;
    data?: any;
  };
  isSystem?: boolean;
}) => {
  switch (type) {
    case AuditType.Module:
      await ModuleAudit.create({
        moduleId: modelId,
        isSystem,
        ...data,
      });
      break;
    case AuditType.StepPrototype:
      await StepPrototypeAudit.create({
        stepPrototypeId: modelId,
        isSystem,
        ...data,
      });
      break;
    case AuditType.Template:
      await TemplateAudit.create({
        templateId: modelId,
        isSystem,
        ...data,
      });

      if (modelId && data.organizationId && data.userId) {
        await Template.update(
          { editedAt: new Date(), editedByUserId: data.userId },
          { where: { id: modelId, organizationId: data.organizationId } }
        );
      }

      break;
    case AuditType.Account:
      await AccountAudit.create({
        accountId: modelId,
        isSystem,
        ...data,
      });
      break;
    case AuditType.GuideBase:
      await GuideBaseAudit.create({
        guideBaseId: modelId,
        ...data,
      });
      break;
    default:
      throw new Error(`Unsupported audit type ${type}`);
  }
};

/**
 * Keep track of the context
 * Usage: create at start of a mutation and call the object
 */
class AuditContext {
  private type: AuditType;
  private modelId: number;
  private contextId: string;
  private userId?: number;
  private organizationId: number;
  private isSystem?: boolean;

  constructor({
    type,
    modelId,
    organizationId,
    userId,
    isSystem,
  }: {
    type: AuditType;
    modelId: number;
    organizationId: number;
    userId?: number;
    /** An event triggered by internal tasks/events */
    isSystem?: boolean;
  }) {
    this.type = type;
    this.modelId = modelId;
    this.userId = userId;
    this.organizationId = organizationId;
    this.contextId = uuidv4();
    this.isSystem = isSystem;
  }

  /**
   * Log an audit event with optional json data for context
   * If target not provided, uses the "top level" object the context was provided with
   */
  public logEvent({
    targets,
    eventName,
    data,
  }: {
    targets?: {
      type: AuditType;
      id: number;
    }[];
    eventName: AuditEvent;
    data?: any;
  }) {
    const _targets = targets
      ? targets
      : [{ type: this.type, id: this.modelId }];

    const commonData = {
      eventName,
      userId: this.userId,
      organizationId: this.organizationId,
      contextId: this.contextId,
      data,
    };

    if (commonData.organizationId)
      _targets.forEach((target) => {
        // Write the event log according to type here
        detachPromise(
          () =>
            createDbEventLog({
              type: target.type,
              modelId: target.id,
              data: commonData,
              isSystem: this.isSystem,
            }),
          'logEvent: createDbEventLog'
        );
      });
  }
}

export default AuditContext;
export { AuditEvent } from 'bento-common/types';
