import testUtils from 'src/testUtils/test.util';
import {
  GroupTargeting,
  RuleTypeEnum,
  TargetingType,
  TargetValueType,
} from 'bento-common/types/targeting';
import { AttributeType } from 'bento-common/types';
import {
  applyAttributeTypes,
  getCategorizedAttrLists,
  validateAttributesUsed,
} from './gptTargeting';
import { CustomAttribute } from 'src/data/models/CustomAttribute.model';

const getContext = testUtils.setup.setupAndSeed('bento');

const getTargetingWithAttributeName = (attrName: string): GroupTargeting => ({
  account: {
    type: TargetingType.all,
    groups: [],
  },
  accountUser: {
    type: TargetingType.attributeRules,
    groups: [
      {
        rules: [
          {
            attribute: attrName,
            ruleType: RuleTypeEnum.equals,
            value: 'wow',
            valueType: TargetValueType.text,
          },
        ],
      },
    ],
  },
});

describe('rule validator', () => {
  test('accepts valid attributes', async () => {
    const { organization } = getContext();

    const attrName = 'jowowed';

    await CustomAttribute.create({
      organizationId: organization.id,
      name: attrName,
      valueType: TargetValueType.text,
    });

    const valid = await validateAttributesUsed(
      getTargetingWithAttributeName(attrName),
      organization.id
    );

    expect(valid).toBeTruthy();
  });

  test('rejects bad attributes', async () => {
    const { organization } = getContext();

    const valid = await validateAttributesUsed(
      getTargetingWithAttributeName('totallyNewAndInvalid'),
      organization.id
    );

    expect(valid).toBeFalsy();
  });
});

describe('rule casting', () => {
  test('casts a value according to original value type', async () => {
    const { organization } = getContext();

    const attrName = 'jowowed';

    await CustomAttribute.create({
      organizationId: organization.id,
      name: attrName,
      valueType: TargetValueType.stringArray,
    });

    const altered = await applyAttributeTypes(
      getTargetingWithAttributeName(attrName),
      organization
    );

    const extracted = altered.accountUser.groups?.[0]?.rules?.[0];

    if (!extracted) throw new Error('we lost something..');

    expect(Array.isArray(extracted.value)).toBeTruthy();
  });

  test('throws on invalid attribute', async () => {
    const { organization } = getContext();
    let thrown = false;

    try {
      await applyAttributeTypes(
        getTargetingWithAttributeName('dne at all'),
        organization
      );
    } catch {
      thrown = true;
    }

    expect(thrown).toBeTruthy();
  });
});

describe('categorizedAttrList', () => {
  describe.each([AttributeType.account, AttributeType.accountUser])(
    'for attribute type %s',
    (attrType) => {
      test.each([TargetValueType.text, TargetValueType.stringArray])(
        'for attribute type %s',
        async (valueType) => {
          const { organization } = getContext();

          const attrName = testUtils.fake.string();

          await CustomAttribute.create({
            organizationId: organization.id,
            name: attrName,
            valueType,
            type: attrType,
          });

          const { availableAttributesByType } = await getCategorizedAttrLists(
            organization
          );

          const bucket: keyof typeof availableAttributesByType =
            attrType === AttributeType.account
              ? valueType === TargetValueType.stringArray
                ? 'availableAccountArrayAttributes'
                : 'availableAccountAttributes'
              : valueType === TargetValueType.stringArray
              ? 'availableUserArrayAttributes'
              : 'availableUserAttributes';

          const search = availableAttributesByType[bucket].find(
            (a) => a === attrName
          );

          expect(search).toBeTruthy();
        }
      );
    }
  );
});
