import { GraphQLFieldResolver, GraphQLObjectType } from 'graphql';
import { differenceInCalendarMonths } from 'date-fns';

import { enumToGraphqlEnum } from 'bento-common/utils/graphql';
import { DiagnosticModules, DiagnosticStates } from 'bento-common/types';
import detachPromise from 'src/utils/detachPromise';
import {
  isDiagnosticCached,
  persistDiagnosticResult,
} from 'src/interactions/clientDiagnostics/diagnostics.helpers';
import { GraphQLContext } from '../types';
import {
  DiagnosticState,
  OrganizationData,
} from 'src/data/models/Analytics/OrganizationData.model';
import { Organization } from 'src/data/models/Organization.model';
import { OrganizationHost } from 'src/data/models/OrganizationHost.model';
import { Account } from 'src/data/models/Account.model';
import { AccountUser } from 'src/data/models/AccountUser.model';
import isEmail from 'validator/lib/isEmail';
import { CLIENT_DIAGNOSTICS_CUTOFF } from 'src/utils/constants';
import { isFunction } from 'lodash';

const DiagnosticState = enumToGraphqlEnum({
  name: 'DiagnosticStateEnum',
  enumType: DiagnosticStates,
  description: 'Health status of a particular diagnostics category',
});

/** How many users to sample */
const BASE_RESOURCE_SAMPLE_SIZE = 10;
const SUB_RESOURCE_SAMPLE_SIZE = 2;

const RECOMMENDED_ACCOUNT_FIELDS = ['createdInOrganizationAt', 'name'];
const RECOMMENDED_ACCOUNT_USER_FIELDS = [
  'createdInOrganizationAt',
  'email',
  'fullName',
];

// Look for any string with whitespace which might indicate a customers is
// sending in user's names as their id
const nameRegex = /\s/gi;

const diagnosticsResolverFactory =
  (
    name: DiagnosticModules,
    test: (o: Organization) => Promise<DiagnosticStates>,
    forceCache?: boolean | ((org: Organization) => boolean)
  ): GraphQLFieldResolver<OrganizationData, GraphQLContext, {}> =>
  async (orgData, _a, { organization }) => {
    const existingValue = orgData?.diagnostics?.[name] as DiagnosticState;

    const forceCacheResult = isFunction(forceCache)
      ? forceCache(organization)
      : forceCache;

    if (isDiagnosticCached(existingValue, forceCacheResult)) {
      return existingValue.state;
    }

    const state = await test(organization);

    /*
     * Being a resolver this won't likely 'bulk' update
     * Letting it slide for now because this is not often accessed
     */
    detachPromise(
      () =>
        persistDiagnosticResult({
          organizationId: organization.id,
          updatedDiagnostics: { [name]: state },
        }),
      'persist diagnostic state'
    );

    return state;
  };

const forceCacheByOrgState = (org: Organization) => {
  const now = new Date();
  return (
    Math.abs(differenceInCalendarMonths(now, org.createdAt)) >
    CLIENT_DIAGNOSTICS_CUTOFF
  );
};

export const OrgDiagnosticsType = new GraphQLObjectType<
  OrganizationData,
  GraphQLContext
>({
  name: 'OrgDiagnostics',
  fields: {
    [DiagnosticModules.hardCodedAccounts]: {
      type: DiagnosticState,
      description: 'There is only one account, indicating possible hard-coding',
      resolve: diagnosticsResolverFactory(
        DiagnosticModules.hardCodedAccounts,
        async (org) => {
          const accounts = await Account.findAll({
            where: { organizationId: org.id },
            limit: 2,
          });

          const count = accounts.length;

          return count === 1
            ? DiagnosticStates.warning
            : count === 0
            ? DiagnosticStates.critical
            : DiagnosticStates.healthy;
        },
        forceCacheByOrgState
      ),
    },
    [DiagnosticModules.hardCodedUsers]: {
      type: DiagnosticState,
      description: 'There is only one user, indicating possible hard-coding',
      resolve: diagnosticsResolverFactory(
        DiagnosticModules.hardCodedUsers,
        async (org) => {
          const accountUsers = await AccountUser.findAll({
            where: { organizationId: org.id },
            limit: 2,
          });

          const count = accountUsers.length;

          return count === 1
            ? DiagnosticStates.warning
            : count === 0
            ? DiagnosticStates.critical
            : DiagnosticStates.healthy;
        },
        forceCacheByOrgState
      ),
    },
    [DiagnosticModules.hasRecommendedAttributes]: {
      type: DiagnosticState,
      description: 'Account users have recommended base attributes',
      resolve: diagnosticsResolverFactory(
        DiagnosticModules.hasRecommendedAttributes,
        async (org) => {
          /**
            NOTE: To investigate attribute warnings for a specific org run this query:

            with accounts as (
              select id, created_in_organization_at, name
              from core.accounts
              where organization_id = <org_id>
              order by updated_at desc
              limit 20
            ), account_users as (
              select
                au.id,
                au.account_id,
                au.created_in_organization_at,
                au.email,
                au.full_name
              from (
                select
                  ROW_NUMBER() over (partition by account_id order by updated_at) as r,
                  *
                from core.account_users
                where account_id in (select id from accounts)
              ) au
              where au.r <= 2
              order by au.account_id asc, au.r asc
            )
            select
              a.name as "account",
              a.created_in_organization_at as "accountCreatedAt",
              au.full_name as "accountUser",
              au.created_in_organization_at as "accountUserCreatedAt",
              au.email as "accountUserEmail"
            from accounts a
            join account_users au on au.account_id = a.id;
           */
          const accounts = await Account.findAll({
            where: { organizationId: org.id },
            limit: BASE_RESOURCE_SAMPLE_SIZE,
            attributes: RECOMMENDED_ACCOUNT_FIELDS,
            include: [
              {
                model: AccountUser,
                attributes: RECOMMENDED_ACCOUNT_USER_FIELDS,
                limit: SUB_RESOURCE_SAMPLE_SIZE,
                order: [['updatedAt', 'DESC']],
              },
            ],
            order: [['updatedAt', 'DESC']],
          });

          if (accounts.length === 0) return DiagnosticStates.critical;

          /** Warn if every sampled user lacks attrs */
          return accounts.every(
            (a) =>
              RECOMMENDED_ACCOUNT_FIELDS.some((field) => !a[field]) ||
              a.accountUsers.every((au) =>
                RECOMMENDED_ACCOUNT_USER_FIELDS.some((field) => !au[field])
              )
          )
            ? DiagnosticStates.warning
            : DiagnosticStates.healthy;
        },
        forceCacheByOrgState
      ),
    },
    [DiagnosticModules.successfulInitialization]: {
      type: DiagnosticState,
      description: 'If we have received a ping from their snippet',
      resolve: diagnosticsResolverFactory(
        DiagnosticModules.successfulInitialization,
        async (org) => {
          const hostnames = await OrganizationHost.findAll({
            where: { organizationId: org.id },
            limit: 1,
          });

          const count = hostnames.length;

          return count > 0
            ? DiagnosticStates.healthy
            : DiagnosticStates.warning;
        }
      ),
    },
    [DiagnosticModules.validAccountUserIds]: {
      type: DiagnosticState,
      description: 'Account user ids do not look like hard-coded emails',
      resolve: diagnosticsResolverFactory(
        DiagnosticModules.validAccountUserIds,
        async (org) => {
          const accountUsers = await AccountUser.findAll({
            where: { organizationId: org.id },
            limit: BASE_RESOURCE_SAMPLE_SIZE,
            attributes: ['id', 'externalId'],
            order: [['updatedAt', 'DESC']],
          });

          /* Testing by "names" is probably not a good idea since there's much guesswork */
          const allEmailsOrNames = accountUsers.every(
            (au) => isEmail(au.externalId) || nameRegex.test(au.externalId)
          );

          return allEmailsOrNames
            ? DiagnosticStates.warning
            : DiagnosticStates.healthy;
        },
        forceCacheByOrgState
      ),
    },
    [DiagnosticModules.inconsistentTypes]: {
      type: DiagnosticState,
      description: 'Attributes change data type',
      resolve: diagnosticsResolverFactory(
        DiagnosticModules.inconsistentTypes,
        // this is checked in `/identify` so it doesn't need to do anything here
        async () => DiagnosticStates.noData,
        true
      ),
    },
    [DiagnosticModules.nonIsoDates]: {
      type: DiagnosticState,
      description: 'Dates are passed in non-ISO format',
      resolve: diagnosticsResolverFactory(
        DiagnosticModules.nonIsoDates,
        // this is checked in `/identify` so it doesn't need to do anything here
        async () => DiagnosticStates.noData,
        true
      ),
    },
  },
});
