import { add, sub } from 'date-fns';
import {
  ClientStorage,
  readFromClientStorage,
  saveToClientStorage,
} from 'bento-common/utils/clientStorage';
import { GuideEntityId } from 'bento-common/types/globalShoyuState';

import {
  filterExpiredModalSeen,
  getModalSessionKey,
  hasSeenAnotherModal,
  MODAL_SEEN_STORAGE_KEY,
  MODAL_SEEN_TTL,
  recordModalSeen,
} from './throttling';
import sessionStore from '../../sessionStore';
import { reviveDates } from './persistence';

jest.mock('../../../lib/graphqlClient');

jest.mock('bento-common/utils/clientStorage', () => ({
  ...jest.requireActual('bento-common/utils/clientStorage'),
  readFromClientStorage: jest.fn(),
  saveToClientStorage: jest.fn(),
}));

beforeAll(() => {
  // sets the info needed to record throttling data
  sessionStore.setState({
    accountUser: { entityId: 'fake-entity-id' } as any,
  });
});

afterAll(() => {
  sessionStore.destroy();
});

describe('getModalSessionKey', () => {
  test('results in `*-${accountUserId}` string', () => {
    expect(getModalSessionKey()).toEqual(
      `${MODAL_SEEN_STORAGE_KEY}-fake-entity-id`
    );
  });
});

describe('hasSeenAnotherModal', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('readFromClientStorage is correctly called', () => {
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(undefined);
    hasSeenAnotherModal(
      'a34267c1-5ae0-48ba-a283-9d1cb201e673' as GuideEntityId
    );
    expect(readFromClientStorage).toHaveBeenCalledWith(
      ClientStorage.sessionStorage,
      expect.stringContaining(MODAL_SEEN_STORAGE_KEY),
      reviveDates
    );
  });

  test('return false when nothing has been throttled', () => {
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(undefined);
    expect(
      hasSeenAnotherModal(
        'a34267c1-5ae0-48ba-a283-9d1cb201e673' as GuideEntityId
      )
    ).toBeFalsy();
  });

  test('return false when this same guide has been throttled', () => {
    const modalSeenEntries = {
      ['a34267c1-5ae0-48ba-a283-9d1cb201e673']: {
        guide: 'a34267c1-5ae0-48ba-a283-9d1cb201e673',
        expireAt: add(new Date(), { hours: 2 }),
      },
    };
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(modalSeenEntries);
    expect(
      hasSeenAnotherModal(
        'a34267c1-5ae0-48ba-a283-9d1cb201e673' as GuideEntityId
      )
    ).toBeFalsy();
  });

  test('return true when another guide has been throttled', () => {
    const modalSeenEntries = {
      ['a34267c1-5ae0-48ba-a283-9d1cb201e673']: {
        guide: 'a34267c1-5ae0-48ba-a283-9d1cb201e673',
        expireAt: add(new Date(), { hours: 2 }),
      },
      ['2a9f8e20-90ca-4e43-9326-8cb3e780b7ab']: {
        guide: '2a9f8e20-90ca-4e43-9326-8cb3e780b7ab',
        expireAt: add(new Date(), { hours: 2 }),
      },
    };
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(modalSeenEntries);
    expect(
      hasSeenAnotherModal(
        'a34267c1-5ae0-48ba-a283-9d1cb201e673' as GuideEntityId
      )
    ).toBeTruthy();
  });
});

describe('cleanExpiredModalSeen', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('readFromClientStorage is correctly called', () => {
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(undefined);
    filterExpiredModalSeen('key');
    expect(readFromClientStorage).toHaveBeenCalledWith(
      ClientStorage.sessionStorage,
      'key',
      reviveDates
    );
  });

  test('returns empty object when nothing has been throttled', () => {
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(undefined);
    expect(filterExpiredModalSeen('key')).toEqual({});
  });

  test('returns same when nothing has expired', () => {
    const modalSeenEntries = {
      ['a34267c1-5ae0-48ba-a283-9d1cb201e673']: {
        guide: 'a34267c1-5ae0-48ba-a283-9d1cb201e673',
        expireAt: add(new Date(), { days: 1 }),
      },
      ['2a9f8e20-90ca-4e43-9326-8cb3e780b7ab']: {
        guide: '2a9f8e20-90ca-4e43-9326-8cb3e780b7ab',
        expireAt: add(new Date(), { hours: 9 }),
      },
    };
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(modalSeenEntries);
    expect(filterExpiredModalSeen('key')).toEqual(modalSeenEntries);
  });

  test('returns only the valid and not expired items', () => {
    const modalSeenEntries = {
      ['2a9f8e20-90ca-4e43-9326-8cb3e780b7ab']: {
        guide: '2a9f8e20-90ca-4e43-9326-8cb3e780b7ab',
      },
      ['c233b8ff-10f2-4d53-b727-9e29fe21b125']: {
        expireAt: add(new Date(), { hours: 2 }),
      },
      // the only one valid and not expired
      ['a34267c1-5ae0-48ba-a283-9d1cb201e673']: {
        guide: 'a34267c1-5ae0-48ba-a283-9d1cb201e673',
        expireAt: add(new Date(), { days: 9 }),
      },
      ['d5319896-7eae-4c2a-9d82-66ec4ea45155']: {
        guide: 'd5319896-7eae-4c2a-9d82-66ec4ea45155',
        expireAt: sub(new Date(), { hours: 2 }),
      },
      invalid: 'foo',
    };
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(modalSeenEntries);
    expect(filterExpiredModalSeen('key')).toEqual({
      ['a34267c1-5ae0-48ba-a283-9d1cb201e673']:
        modalSeenEntries['a34267c1-5ae0-48ba-a283-9d1cb201e673'],
    });
  });
});

describe('recordModalSeen', () => {
  const nowMock = new Date();
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(nowMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('records new throttled entry', () => {
    const expiredOrInvalidEntries = {
      ['d5319896-7eae-4c2a-9d82-66ec4ea45155']: {
        guide: 'd5319896-7eae-4c2a-9d82-66ec4ea45155',
        expireAt: sub(new Date(), { hours: 2 }),
      },
      invalid: 'foo',
    };
    (readFromClientStorage as jest.Mock).mockReturnValueOnce(
      expiredOrInvalidEntries
    );
    recordModalSeen('foo' as GuideEntityId);
    expect(saveToClientStorage).toHaveBeenCalledWith(
      ClientStorage.sessionStorage,
      'bento-modalSeen-fake-entity-id',
      {
        ['foo']: {
          guide: 'foo',
          expireAt: new Date(nowMock.getTime() + MODAL_SEEN_TTL),
        },
      }
    );
  });
});
