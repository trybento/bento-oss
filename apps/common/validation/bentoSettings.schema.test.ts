import { faker } from '@faker-js/faker';
import assertBentoSettings from './bentoSettings.schema';
import {
  MAX_CUSTOM_ATTRIBUTES_COUNT,
  CUSTOM_ATTRIBUTE_VALUE_MAX_LENGTH,
  CUSTOM_ATTRIBUTE_URL_MAX_LENGTH,
} from './customRules';

const VALID_APP_ID = 'bec15fa4-6803-11eb-b454-d756c991927e';

describe('assertBentoSettings', () => {
  test('accepts a valid settings object', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc123',
        name: 'Acme Corp',
      },
      accountUser: {
        id: 'abc456',
        customProp: 'hello',
        avatarUrl: null,
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('throws if appId is not set', () => {
    const settings = {
      account: {
        id: VALID_APP_ID,
        name: 'Acme Corp',
      },
      accountUser: {
        id: 'abcd123',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: appId -- Expected a valid Bento App Id, but received: undefined'
    );
  });

  test('throws if appId is invalid', () => {
    const settings = {
      appId: 'BENTO_APP_ID',
      account: {
        id: VALID_APP_ID,
        name: 'Acme Corp',
      },
      accountUser: {
        id: 'abcd123',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: appId -- Expected a valid Bento App Id, but received: BENTO_APP_ID'
    );
  });

  test('throws if appId is null', () => {
    const settings = {
      appId: null,
      account: {
        id: VALID_APP_ID,
        name: 'Acme Corp',
      },
      accountUser: {
        id: 'abcd123',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: appId -- Expected a valid Bento App Id, but received: null'
    );
  });

  test('throws if account name is empty string', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
        name: '',
      },
      accountUser: {
        id: 'abcd123',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: account.name -- Expected a valid string (non-empty containing at least one alpha numeric char), but received:'
    );
  });

  test('throws if account name does not contain at least one alphaNum char', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
        name: '@!_:-.+{[]}|',
      },
      accountUser: {
        id: 'abcd123',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: account.name -- Expected a valid string (non-empty containing at least one alpha numeric char), but received: @!_:-.+{[]}|'
    );
  });

  test('throws if account name only contains HTML encoded apostrophes', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
        name: ' &#39; &#x27; ',
      },
      accountUser: {
        id: 'abcd123',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: account.name -- Expected a valid string (non-empty containing at least one alpha numeric char), but received:  &#39; &#x27; '
    );
  });

  test('wont throw if account name does contain at least one alpha numeric char', () => {
    expect(() => {
      assertBentoSettings({
        appId: VALID_APP_ID,
        account: {
          id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
          name: '@!a_:-.+{[]}|',
        },
        accountUser: {
          id: 'abcd123',
        },
      });
      assertBentoSettings({
        appId: VALID_APP_ID,
        account: {
          id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
          name: '@!_:-.+1{[]}|',
        },
        accountUser: {
          id: 'abcd123',
        },
      });
    }).not.toThrow();
  });

  test('wont throw if account name is small set of alphaNum chars without the symbols', () => {
    expect(() => {
      assertBentoSettings({
        appId: VALID_APP_ID,
        account: {
          id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
          name: 'DHL',
        },
        accountUser: {
          id: 'abcd123',
        },
      });
      assertBentoSettings({
        appId: VALID_APP_ID,
        account: {
          id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
          name: 'G2',
        },
        accountUser: {
          id: 'abcd123',
        },
      });
      assertBentoSettings({
        appId: VALID_APP_ID,
        account: {
          id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
          name: 'B3',
        },
        accountUser: {
          id: 'abcd123',
        },
      });
      assertBentoSettings({
        appId: VALID_APP_ID,
        account: {
          id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
          name: 'A',
        },
        accountUser: {
          id: 'abcd123',
        },
      });
      assertBentoSettings({
        appId: VALID_APP_ID,
        account: {
          id: '7a0d9fa4-3cba-4221-8015-21c3b955a33f',
          name: '3',
        },
        accountUser: {
          id: 'abcd123',
        },
      });
    }).not.toThrow();
  });

  test('throws if custom attr value is too big', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'cf28192b-ce21-4f70-8e33-630243efb7ea',
        name: 'Acme Corp',
      },
      accountUser: {
        id: 'abcd123',
        extra: new Array(CUSTOM_ATTRIBUTE_VALUE_MAX_LENGTH + 1)
          .fill('a')
          .join(''),
      },
    };
    expect(() => assertBentoSettings(settings)).toThrow(
      `At path: accountUser.extra -- Expected a valid string (up to ${CUSTOM_ATTRIBUTE_VALUE_MAX_LENGTH} characters), but received one with ${settings.accountUser.extra.length} characters.`
    );
  });

  test('throws if custom attr key is too big', () => {
    const longAttr =
      'thisIsSupposedToBeARidiculouslyLongCutromAttributeKeyThatShouldCauseAnErrorWhenValidatingBentoSettings';
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: new Date(),
        [longAttr]: 'tiny',
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: new Date(),
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      `At path: account.thisIsSupposedToBeARidiculouslyLongCutromAttributeKeyThatShouldCauseAnErrorWhenValidatingBentoSettings -- Expected a string with a length between \`1\` and \`64\` but received one with a length of \`${longAttr.length}\``
    );
  });

  test.each(['id', 'name'])('throws if account.%s value is too big', (key) => {
    const maxLength = 128;
    const longValue = new Array(maxLength + 2).join('a');
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: new Date(),
        ...{ [key]: longValue },
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: new Date(),
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      `At path: account.${key} -- Expected a string with a length between \`1\` and \`${maxLength}\` but received one with a length of \`${longValue.length}\``
    );
  });

  test('throws if account custom attribute value is too big', () => {
    const maxLength = 256;
    const longValue = new Array(maxLength + 2).join('a');
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: new Date(),
        extra: longValue,
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: new Date(),
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      `At path: account.extra -- Expected a valid string (up to ${maxLength} characters), but received one with ${longValue.length} characters.`
    );
  });

  test.each(['id', 'fullName'])(
    'throws if accountUser.%s value is too big',
    (key) => {
      const maxLength = 128;
      const longValue = new Array(maxLength + 2).join('a');
      const settings = {
        appId: VALID_APP_ID,
        account: {
          id: 'abc',
          name: 'Acme Corp',
          createdAt: new Date(),
        },
        accountUser: {
          id: 'foo-bar',
          createdAt: new Date(),
          ...{ [key]: longValue },
        },
      };
      expect(() => {
        assertBentoSettings(settings);
      }).toThrow(
        `At path: accountUser.${key} -- Expected a string with a length between \`1\` and \`${maxLength}\` but received one with a length of \`${longValue.length}\``
      );
    }
  );

  test('throws if accountUser custom attribute value is too big', () => {
    const maxLength = 256;
    const longValue = new Array(maxLength + 2).join('a');
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: new Date(),
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: new Date(),
        extra: longValue,
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      `At path: accountUser.extra -- Expected a valid string (up to ${maxLength} characters), but received one with ${longValue.length} characters.`
    );
  });

  test.each(['account', 'accountUser'])(
    '%s accepts custom attribute valid urls up to 2048 chars',
    (namespace) => {
      const path = new Array(32 + 1).join('a');
      let longUrl = `${faker.internet.url()}${[...new Array(2048 / path.length)]
        .map(() => `/${path}`)
        .join('')}`;
      longUrl = longUrl.slice(0, 2048 - longUrl.length);
      const settings = {
        appId: VALID_APP_ID,
        account: {
          id: 'abc',
          name: 'Acme Corp',
          createdAt: new Date(),
        },
        accountUser: {
          id: 'foo-bar',
          createdAt: new Date(),
        },
      };
      settings[namespace] = { ...settings[namespace], randomKey: longUrl };
      expect(() => {
        assertBentoSettings(settings);
      }).not.toThrow();
    }
  );

  test.each(['account', 'accountUser'])(
    'throws if %s custom attribute is url but is too big',
    (namespace) => {
      const path = new Array(32 + 1).join('a');
      const longUrl = `${faker.internet.url()}${[
        ...new Array(2048 / path.length),
      ]
        .map(() => `/${path}`)
        .join('')}`;

      const settings = {
        appId: VALID_APP_ID,
        account: {
          id: 'abc',
          name: 'Acme Corp',
          createdAt: new Date(),
        },
        accountUser: {
          id: 'foo-bar',
          createdAt: new Date(),
        },
      };
      settings[namespace] = { ...settings[namespace], randomKey: longUrl };
      expect(() => {
        assertBentoSettings(settings);
      }).toThrow(
        `At path: ${namespace}.randomKey -- Expected a valid url (up to ${CUSTOM_ATTRIBUTE_URL_MAX_LENGTH} characters), but received one with ${longUrl.length} characters.`
      );
    }
  );

  test.each(['account', 'accountUser'])(
    'throws if %s has too many keys',
    (namespace) => {
      const customAttrs = [
        ...Array(MAX_CUSTOM_ATTRIBUTES_COUNT + 1).keys(),
      ].reduce((acc, _value, index) => {
        return {
          ...acc,
          [`${faker.hacker.adjective()}${index}`]: faker.number.int(),
        };
      }, {});
      const settings = {
        appId: VALID_APP_ID,
        account: {
          id: 'abc',
          name: 'Acme Corp',
          createdAt: new Date(),
        },
        accountUser: {
          id: 'foo-bar',
          createdAt: new Date(),
        },
      };
      settings[namespace] = { ...settings[namespace], ...customAttrs };
      expect(() => {
        assertBentoSettings(settings);
      }).toThrow(
        `At path: ${namespace} -- Expected a maximum of \`${MAX_CUSTOM_ATTRIBUTES_COUNT}\` custom attributes but received \`${
          MAX_CUSTOM_ATTRIBUTES_COUNT + 1
        }\``
      );
    }
  );

  test('throws if multiple required properties are not set', () => {
    const settings = {
      appId: VALID_APP_ID,
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow();
  });

  test('accepts a string custom property', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc123',
        name: 'Acme Corp',
        customProp: 'hello',
      },
      accountUser: {
        id: 'abc456',
        customProp: 'hello',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('accepts a number custom property', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc123',
        name: 'Acme Corp',
        customProp: 123,
      },
      accountUser: {
        id: 'abc456',
        customProp: 123,
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('accepts a boolean custom property', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc123',
        name: 'Acme Corp',
        customProp: true,
      },
      accountUser: {
        id: 'abc456',
        customProp: false,
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('accepts a Date custom property', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc123',
        name: 'Acme Corp',
        customProp: new Date(),
      },
      accountUser: {
        id: 'abc456',
        customProp: new Date(),
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('accepts an undefined custom property', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc123',
        name: 'Acme Corp',
        customProp: undefined,
      },
      accountUser: {
        id: 'abc456',
        customProp: undefined,
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('throws if a custom property does not have a valid type (array)', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        customProp: [123],
      },
      accountUser: {
        id: 'abcd123',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: account.customProp -- At path: 0 -- Expected a string, but received: 123'
    );
  });

  test('throws if a custom property does not have a valid type (object)', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        customProp: {},
      },
      accountUser: {
        id: 'abcd123',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: account.customProp -- Expected the value to satisfy a union of `string | date | number | boolean | array`, but received: [object Object]'
    );
  });

  test('createdAt can be ISO strings', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: new Date().toISOString(),
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: new Date().toISOString(),
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('createdAt can be Date objects', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: new Date(),
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: new Date(),
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('createdAt can be other date strings', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: new Date().toDateString(),
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: new Date().toString(),
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('createdAt can be null', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: null,
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: null,
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).not.toThrow();
  });

  test('throws if createdAt is not a valid date', () => {
    const settings = {
      appId: VALID_APP_ID,
      account: {
        id: 'abc',
        name: 'Acme Corp',
        createdAt: 'invalid date',
      },
      accountUser: {
        id: 'foo-bar',
        createdAt: 'invalid date',
      },
    };
    expect(() => {
      assertBentoSettings(settings);
    }).toThrow(
      'At path: account.createdAt -- Expected the value to satisfy a union of `ISO8601 Date | DateString | date`, but received: "invalid date"'
    );
  });

  describe('array attributes', () => {
    test('basic strings', () => {
      const settings = {
        appId: VALID_APP_ID,
        account: {
          id: 'abc',
          name: 'Acme Corp',
          createdAt: new Date(),
          extra: ['one', 'two', 'three'],
        },
        accountUser: {
          id: 'foo-bar',
          createdAt: new Date(),
          extra: ['one', 'two', 'three'],
        },
      };
      expect(() => {
        assertBentoSettings(settings);
      }).not.toThrow();
    });

    test('basic urls', () => {
      const settings = {
        appId: VALID_APP_ID,
        account: {
          id: 'abc',
          name: 'Acme Corp',
          createdAt: new Date(),
          extra: new Array(3).fill('').map(() => faker.internet.url()),
        },
        accountUser: {
          id: 'foo-bar',
          createdAt: new Date(),
          extra: new Array(3).fill('').map(() => faker.internet.url()),
        },
      };
      expect(() => {
        assertBentoSettings(settings);
      }).not.toThrow();
    });

    test.each([
      ['url', CUSTOM_ATTRIBUTE_URL_MAX_LENGTH],
      ['string', CUSTOM_ATTRIBUTE_VALUE_MAX_LENGTH],
    ])('honors string length limits: %s', (type, maxLength) => {
      const longString = new Array(maxLength).join('a');
      const settings = {
        appId: VALID_APP_ID,
        account: {
          id: 'abc',
          name: 'Acme Corp',
          createdAt: new Date(),
        },
        accountUser: {
          id: 'foo-bar',
          createdAt: new Date(),
          extra: new Array(3)
            .fill('')
            .map(() =>
              type === 'url'
                ? `${faker.internet.url()}/${longString}`
                : `${longString}thismakesittoolong`
            ),
        },
      };
      expect(() => {
        assertBentoSettings(settings);
      }).toThrow(
        `At path: accountUser.extra -- At path: 0 -- Expected a valid ${type} (up to ${maxLength} characters), but received one with ${settings.accountUser.extra[0].length} characters.`
      );
    });

    test.each([3, true, null, undefined, new Date()])(
      'does not allow non-string values: %s',
      (value) => {
        const settings = {
          appId: VALID_APP_ID,
          account: {
            id: 'abc',
            name: 'Acme Corp',
            createdAt: new Date(),
          },
          accountUser: {
            id: 'foo-bar',
            createdAt: new Date(),
            extra: ['one', 'two', value],
          },
        };
        expect(() => {
          assertBentoSettings(settings);
        }).toThrow(
          `At path: accountUser.extra -- At path: 2 -- Expected a string, but received: ${value}`
        );
      }
    );

    test('does not allow arrays for "base" attributes', () => {
      const settings = {
        appId: VALID_APP_ID,
        account: {
          id: 'abc',
          name: ['Acme Corp', 'Something else'],
          createdAt: new Date(),
        },
        accountUser: {
          id: 'foo-bar',
          createdAt: new Date(),
          extra: new Array(3).fill('').map(() => faker.internet.url()),
        },
      };
      expect(() => {
        assertBentoSettings(settings);
      }).toThrow(
        'At path: account.name -- Expected a valid string (non-empty containing at least one alpha numeric char), but received: Acme Corp,Something else'
      );
    });
  });
});
