import { createInternalFeatureFlag, deleteInternalFeatureFlag } from './db';
import { internalFeatureFlag } from './api';

import { setupAndSeedDatabaseForTests } from 'src/data/datatests';
import {
  InternalFeatureFlag,
  InternalFeatureFlagStrategies,
} from 'src/data/models/Utility/InternalFeatureFlag.model';
import { percentage } from 'src/utils/internalFeatures/strategies';
import { sequelize } from 'src/data';
import { trackAccountUserAppActivity } from 'src/interactions/analytics/trackAccountUserAppActivity';

jest.mock('src/utils/detachPromise');
jest.mock('src/utils/internalFeatures/strategies');

setupAndSeedDatabaseForTests('bento', () => ({
  randomExtraContext: { blah: 'woot' },
}));

const FF_NAME = 'enable dummy feature';

const createFlag = async (
  strategy: InternalFeatureFlagStrategies,
  options: Record<string, any> | null = null
) => {
  await createInternalFeatureFlag(
    {
      name: FF_NAME,
      strategy,
      options,
    },
    sequelize.getQueryInterface()
  );
};

describe('InternalFlag', () => {
  afterEach(async () => {
    await deleteInternalFeatureFlag(FF_NAME, sequelize.getQueryInterface());
    await internalFeatureFlag(FF_NAME).invalidateCache();
  });

  test('cache prevents calling the db more than once', async () => {
    await createFlag(InternalFeatureFlagStrategies.All);
    const spied = jest.spyOn(InternalFeatureFlag, 'findOne');
    for (let i = 0; i < 5; i++) {
      await internalFeatureFlag(FF_NAME, 900, true).enabled();
    }
    expect(spied).toBeCalledTimes(1);
  });

  test('flag strategy All always return true', async () => {
    await createFlag(InternalFeatureFlagStrategies.All);
    const result = await internalFeatureFlag(FF_NAME).enabled();
    expect(result).toEqual(true);
  });

  test('flag strategy None always return false', async () => {
    await createFlag(InternalFeatureFlagStrategies.None);
    const result = await internalFeatureFlag(FF_NAME).enabled();
    expect(result).toEqual(false);
  });

  test('flag strategy Percentage calls strategy method', async () => {
    await createFlag(InternalFeatureFlagStrategies.Percentage, {
      percentage: 50,
    });
    await internalFeatureFlag(FF_NAME).enabled();
    expect(percentage).toHaveBeenCalledWith({ percentage: 50 });
  });

  test('flag strategy string match takes env values', async () => {
    const ENV_KEY = 'BENTO_INFRA_LEAD';
    const ENV_VALUE = 'John Rio';

    await createFlag(InternalFeatureFlagStrategies.stringMatch, {
      stringMatch: {
        key: ENV_KEY,
        value: ENV_VALUE,
      },
    });
    const enabledNull = await internalFeatureFlag(FF_NAME).enabled();

    expect(enabledNull).toBeFalsy();

    process.env[ENV_KEY] = ENV_VALUE;

    const enabledSet = await internalFeatureFlag(FF_NAME).enabled();

    expect(enabledSet).toBeTruthy();
  });

  test('flag strategy string match takes payload values', async () => {
    const PAYLOAD_KEY = 'AWSMVP';
    const PAYLOAD_VALUE = 'AlliStar';

    await createFlag(InternalFeatureFlagStrategies.stringMatch, {
      stringMatch: {
        key: PAYLOAD_KEY,
        value: PAYLOAD_VALUE,
      },
    });
    const enabledNull = await internalFeatureFlag(FF_NAME).enabled({
      [PAYLOAD_KEY]: 'Andi Chen',
    });

    expect(enabledNull).toBeFalsy();

    const enabledSet = await internalFeatureFlag(FF_NAME).enabled({
      [PAYLOAD_KEY]: PAYLOAD_VALUE,
    });

    expect(enabledSet).toBeTruthy();
  });

  test('flag strategy string match matches against multiple values', async () => {
    const PAYLOAD_KEY = 'TEA_ENJOYER';
    const PAYLOAD_VALUE_1 = 'Miirao';
    const PAYLOAD_VALUE_2 = 'Anndhi';

    await createFlag(InternalFeatureFlagStrategies.stringMatch, {
      stringMatch: {
        key: PAYLOAD_KEY,
        value: [PAYLOAD_VALUE_1, PAYLOAD_VALUE_2],
      },
    });
    const enabledNull = await internalFeatureFlag(FF_NAME).enabled({
      [PAYLOAD_KEY]: 'Andi Chen',
    });

    expect(enabledNull).toBeFalsy();

    const enabledSet1 = await internalFeatureFlag(FF_NAME).enabled({
      [PAYLOAD_KEY]: PAYLOAD_VALUE_1,
    });

    expect(enabledSet1).toBeTruthy();

    const enabledSet2 = await internalFeatureFlag(FF_NAME).enabled({
      [PAYLOAD_KEY]: PAYLOAD_VALUE_2,
    });

    expect(enabledSet2).toBeTruthy();
  });
});
