import { LaunchReportLog } from 'src/data/models/Audit/LaunchReport.model';
import detachPromise from 'src/utils/detachPromise';

import {
  LaunchFailureReason,
  RuleResult,
  LaunchReportPayload,
} from 'bento-common/types/diagnostics';
import { addLaunchReportToContext } from '../troubleshooter/troubleshooting';

type LaunchReportType = LaunchReportPayload['type'];
export class LaunchReport {
  private type: LaunchReportType;
  private templateId?: number;
  private accountUserId?: number;
  private accountId?: number;
  private organizationId: number;

  private checks: LaunchReportPayload['checks'] = {};

  /**
   * @param type If we're checking one account user against multiple templates, or one template against account/users
   * @param baseId The ID of the template or account user we're checking
   * @param organizationId Org id
   */
  constructor(type: LaunchReportType, baseId: number, organizationId: number) {
    this.type = type;
    this.organizationId = organizationId;

    switch (type) {
      case 'account':
        this.accountId = baseId;
        break;
      case 'accountUser':
        this.accountUserId = baseId;
        break;
      case 'template':
        this.templateId = baseId;
        break;
      default:
      // Nope
    }
  }

  /** Write report to db (detached), or send to result hook if found. */
  public write() {
    if (!this.accountId && !this.accountUserId && !this.templateId) return;

    const report: LaunchReportPayload = {
      type: this.type,
      [`${this.type}Id`]:
        this.templateId || this.accountId || this.accountUserId,
      checks: this.checks,
    };

    const ranHook = addLaunchReportToContext(report);

    if (ranHook) return;

    const ids = {
      templateId: this.templateId,
      accountId: this.accountId,
      accountUserId: this.accountUserId,
      organizationId: this.organizationId,
    };

    detachPromise(
      async () =>
        LaunchReportLog.create({
          ...ids,
          report,
        }),
      'LaunchReport: LaunchReportLog.create'
    );
  }

  /**
   * Add matching log
   */
  public addMatchLog(
    /** What are we checking against? */
    type: LaunchReportType,
    /** The template or account/user being checked */
    checkId: number,
    /** The results of the match */
    result: RuleResult,
    context?: any
  ) {
    this.checks[`${type}_${checkId}`] = { result, context };
    return this;
  }

  /**
   * Add data log (missing or found)
   **/
  public addDataLog(scope: LaunchFailureReason, found = false) {
    this.checks[scope] = found ? 'found' : 'not found';
    return this;
  }
}
