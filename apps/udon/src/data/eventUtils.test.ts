import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import {
  createDummyAccountUsers,
  launchDefaultTemplate,
} from '../testUtils/dummyDataHelpers';

import {
  triggerAvailableGuidesChangedForGuideBases,
  triggerAvailableGuidesChangedForGuides,
  triggerAvailableGuidesChangedForModules,
  triggerAvailableGuidesChangedForTemplates,
  triggerGuideBaseChangedForSteps,
  triggerGuideChangedForSteps,
  triggerStepAutoCompleteInteractionsChangedForGuides,
} from './eventUtils';
import { Template } from './models/Template.model';
import { Guide } from './models/Guide.model';
import { Step } from './models/Step.model';
import {
  guideChanged,
  guideBaseChanged,
  availableGuidesChanged,
  stepAutoCompleteInteractionsChanged,
} from 'src/data/events';
import { GuideParticipant } from './models/GuideParticipant.model';
import { GuideModule } from './models/GuideModule.model';
import { Module } from './models/Module.model';
import { faker } from '@faker-js/faker';

jest.mock('src/utils/detachPromise');

jest.mock('src/data/events', () => {
  // useful to debug tests
  const _callee = (...args) => void console.log('called with', args);
  return {
    ...jest.requireActual('src/data/events'),
    availableGuidesChanged: jest.fn(),
    guideBaseChanged: jest.fn(),
    guideChanged: jest.fn(),
    stepAutoCompleteInteractionsChanged: jest.fn(),
  };
});

const getContext = setupAndSeedDatabaseForTests('bento');

afterEach(() => {
  jest.resetAllMocks();
});

describe('eventUtils', () => {
  describe('triggerGuideChangedForSteps', () => {
    test('calls guideChanged with guide entityId', async () => {
      const { organization, account } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
      });

      const someStepOfGuide = await Step.findOne({
        where: {
          organizationId: organization.id,
          guideId: newGuide!.id,
        },
      });

      if (!someStepOfGuide) throw new Error('missing step of guide');

      expect.assertions(1);

      (guideChanged as jest.Mock).mockImplementation((entityId) => {
        expect(entityId).toEqual(newGuide!.entityId);
      });

      triggerGuideChangedForSteps([someStepOfGuide]);
    });

    test('wont call guideChanged if guide is missing', async () => {
      const { organization } = getContext();

      const someFakeStep = new Step({
        organizationId: organization.id,
        createdFromStepPrototypeId: faker.datatype.number(),
        createdFromGuideStepBaseId: faker.datatype.number(),
        guideModuleId: faker.datatype.number(),
        guideId: faker.datatype.number(),
      });

      (guideChanged as jest.Mock).mockReset();

      (guideChanged as jest.Mock).mockImplementation(() => {
        throw new Error('should not have been called');
      });

      triggerGuideChangedForSteps([someFakeStep]);

      expect(guideChanged).not.toHaveBeenCalled();
    });
  });

  describe('triggerGuideBaseChangedForSteps', () => {
    test('calls guideBaseChanged with guide entityId', async () => {
      const { organization, account } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
      });

      const someStepOfGuide = await Step.findOne({
        where: {
          organizationId: organization.id,
          guideId: newGuide!.id,
        },
      });

      if (!someStepOfGuide) throw new Error('missing step of guide');

      expect.assertions(1);

      (guideBaseChanged as jest.Mock).mockImplementation((entityId) => {
        expect(entityId).toEqual(newGuideBase.entityId);
      });

      triggerGuideBaseChangedForSteps([
        someStepOfGuide,
        new Step({ ...someStepOfGuide, id: 9871389713 }),
      ]);
    });

    test('wont call guideBaseChanged if guideBase is missing', async () => {
      const { organization } = getContext();

      const someFakeStep = new Step({
        organizationId: organization.id,
        createdFromStepPrototypeId: faker.datatype.number(),
        createdFromGuideStepBaseId: faker.datatype.number(),
        guideModuleId: faker.datatype.number(),
        guideId: faker.datatype.number(),
      });

      (guideBaseChanged as jest.Mock).mockReset();

      (guideBaseChanged as jest.Mock).mockImplementation(() => {
        throw new Error('should not have been called');
      });

      triggerGuideBaseChangedForSteps([someFakeStep]);

      expect(guideBaseChanged).not.toHaveBeenCalled();
    });
  });

  describe('triggerAvailableGuidesChangedForGuides', () => {
    test('calls availableGuidesChanged with accountUser externalId', async () => {
      const { organization, account } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
      });

      const dummyAccountUser = (
        await createDummyAccountUsers(organization, account, 1)
      )[0];

      await GuideParticipant.create({
        organizationId: organization.id,
        accountUserId: dummyAccountUser.id,
        guideId: newGuide!.id,
      });

      expect.assertions(1);

      (availableGuidesChanged as jest.Mock).mockImplementation((entityId) => {
        expect(entityId).toEqual(dummyAccountUser.externalId);
      });

      triggerAvailableGuidesChangedForGuides([newGuide!]);
    });

    test('wont call availableGuidesChanged if participants are missing', async () => {
      const { organization, account, accountUser } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
      });

      (availableGuidesChanged as jest.Mock).mockImplementation(() => {
        throw new Error('should not have been called');
      });

      expect(() => {
        triggerAvailableGuidesChangedForGuides([newGuide!]);
      }).not.toThrow();

      expect(availableGuidesChanged).not.toHaveBeenCalled();
    });
  });

  describe('triggerAvailableGuidesChangedForGuideBases', () => {
    test('calls availableGuidesChanged with accountUser externalId', async () => {
      const { organization, account } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
      });

      const dummyAccountUser = (
        await createDummyAccountUsers(organization, account, 1)
      )[0];

      await GuideParticipant.create({
        organizationId: organization.id,
        accountUserId: dummyAccountUser.id,
        guideId: newGuide!.id,
      });

      expect.assertions(1);

      (availableGuidesChanged as jest.Mock).mockImplementation((entityId) => {
        expect(entityId).toEqual(dummyAccountUser.externalId);
      });

      triggerAvailableGuidesChangedForGuideBases([newGuideBase]);
    });

    test('wont call availableGuidesChanged if participants are missing', async () => {
      const { organization, account, accountUser } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      (availableGuidesChanged as jest.Mock).mockImplementation(() => {
        throw new Error('should not have been called');
      });

      expect(() => {
        triggerAvailableGuidesChangedForGuideBases([newGuideBase]);
      }).not.toThrow();

      expect(availableGuidesChanged).not.toHaveBeenCalled();
    });
  });

  describe('triggerAvailableGuidesChangedForTemplates', () => {
    test('calls availableGuidesChanged with accountUser externalId', async () => {
      const { organization, account } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
      });

      const dummyAccountUser = (
        await createDummyAccountUsers(organization, account, 1)
      )[0];

      await GuideParticipant.create({
        organizationId: organization.id,
        accountUserId: dummyAccountUser.id,
        guideId: newGuide!.id,
      });

      expect.assertions(1);

      (availableGuidesChanged as jest.Mock).mockImplementation((entityId) => {
        expect(entityId).toEqual(dummyAccountUser.externalId);
      });

      triggerAvailableGuidesChangedForTemplates([template!]);
    });

    test('wont call availableGuidesChanged if participants are missing', async () => {
      const { organization, account, accountUser } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
      });

      (availableGuidesChanged as jest.Mock).mockImplementation(() => {
        throw new Error('should not have been called');
      });

      expect(() => {
        triggerAvailableGuidesChangedForTemplates([template!]);
      }).not.toThrow();

      expect(availableGuidesChanged).not.toHaveBeenCalled();
    });
  });

  describe('triggerAvailableGuidesChangedForModules', () => {
    test('calls availableGuidesChanged with accountUser externalId', async () => {
      const { organization, account } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
        include: [
          {
            model: GuideModule,
            include: [Module],
          },
        ],
      });

      const modules =
        (newGuide!.guideModules
          .map((gm) => gm.createdFromModule)
          .filter(Boolean) as Module[]) || [];

      const dummyAccountUser = (
        await createDummyAccountUsers(organization, account, 1)
      )[0];

      await GuideParticipant.create({
        organizationId: organization.id,
        accountUserId: dummyAccountUser.id,
        guideId: newGuide!.id,
      });

      expect.assertions(1);

      (availableGuidesChanged as jest.Mock).mockImplementation((entityId) => {
        expect(entityId).toEqual(dummyAccountUser.externalId);
      });

      triggerAvailableGuidesChangedForModules(modules);
    });

    test('wont call availableGuidesChanged if participants are missing', async () => {
      const { organization, account, accountUser } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
        include: [
          {
            model: GuideModule,
            include: [Module],
          },
        ],
      });

      const modules =
        (newGuide!.guideModules
          .map((gm) => gm.createdFromModule)
          .filter(Boolean) as Module[]) || [];

      (availableGuidesChanged as jest.Mock).mockImplementation(() => {
        throw new Error('should not have been called');
      });

      expect(() => {
        triggerAvailableGuidesChangedForModules(modules);
      }).not.toThrow();

      expect(availableGuidesChanged).not.toHaveBeenCalled();
    });
  });

  describe('triggerStepAutoCompleteInteractionsChangedForGuides', () => {
    test('calls stepAutoCompleteInteractionsChanged with accountUser externalId', async () => {
      const { organization, account } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
      });

      const dummyAccountUser = (
        await createDummyAccountUsers(organization, account, 1)
      )[0];

      await GuideParticipant.create({
        organizationId: organization.id,
        accountUserId: dummyAccountUser.id,
        guideId: newGuide!.id,
      });

      expect.assertions(1);

      (stepAutoCompleteInteractionsChanged as jest.Mock).mockImplementation(
        (entityId) => {
          expect(entityId).toEqual(dummyAccountUser.externalId);
        }
      );

      triggerStepAutoCompleteInteractionsChangedForGuides([newGuide!]);
    });

    test('wont call stepAutoCompleteInteractionsChanged if participants are missing', async () => {
      const { organization, account, accountUser } = getContext();

      const template = await Template.findOne({
        where: { organizationId: organization.id },
      });

      const newGuideBase = await launchDefaultTemplate({
        organization,
        account,
        templateId: template!.id,
      });

      const newGuide = await Guide.findOne({
        where: {
          organizationId: organization.id,
          createdFromGuideBaseId: newGuideBase.id,
        },
        include: [
          {
            model: GuideModule,
            include: [Module],
          },
        ],
      });

      (stepAutoCompleteInteractionsChanged as jest.Mock).mockImplementation(
        () => {
          throw new Error('should not have been called');
        }
      );

      expect(() => {
        triggerStepAutoCompleteInteractionsChangedForGuides([newGuide!]);
      }).not.toThrow();

      expect(stepAutoCompleteInteractionsChanged).not.toHaveBeenCalled();
    });
  });
});
