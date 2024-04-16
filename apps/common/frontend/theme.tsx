import React from 'react';
import { extendTheme, ThemeExtension } from '@chakra-ui/react';
import { RecursivePartial } from 'bento-common/types';
import colors from './colors';

const cerulean = {
  50: '#DCE8FF',
  100: '#C9DCFE',
  200: '#A4C4FE',
  300: '#81ACFE',
  400: '#5D95FD',
  500: '#4C83EB',
  600: '#1960E6',
  700: '#1654CA',
  800: '#0E3581',
  900: '#09214E',
};

const silver = {
  50: '#f7f8f8',
  100: '#edeeee',
  200: '#e2e2e3',
  300: '#d6d7d8',
  400: '#cbcccd',
  500: '#c0c1c3',
  600: '#9e9ea0',
  700: '#7b7b7d',
  800: '#585859',
  900: '#353536',
};

const bento = {
  50: '#e2efff',
  100: '#b7d0fc',
  200: '#8ab0f5',
  300: '#5d91ee',
  400: '#3071e8',
  500: '#185ddc',
  600: '#0e44a2',
  700: '#073175',
  800: '#011d49',
  900: '#000a1e',
  errorText: '#9B2C2C',
  border: '#E2E8F0',
  ...colors.bento,
};

const icon = {
  primary: '#2D3748',
  secondary: '#718096',
};

const additionalSizes = {
  '-1': '-0.25rem',
  '-2': '-0.50rem',
  '-3': '-0.75rem',
  '-4': '-1.00rem',
  '-6': '-1.50rem',
  '-8': '-2.00rem',
  '7': '1.75rem',
  '9': '2.25rem',
  '11': '2.75rem',
  '13': '3.25rem',
  '14': '3.5rem',
  '15': '3.75rem',
};

const theme = extendTheme({
  breakpoints: {
    sm: '36em',
    md: '48em',
    lg: '75em',
    xl: '100%',
  },
  colors: {
    cerulean,
    bento,
    icon,
    silver,
    border: '#cbd5e0',
    'b-primary': cerulean,
    logo: '#73a4fc',
    'transparent-cerulean': '#e7efff',
    error: colors.error,
    warning: colors.warning,
    text: colors.text,
  },
  components: {
    Checkbox: {
      defaultProps: {
        variant: 'bento',
      },
      variants: {
        bento: {
          control: {
            _checked: {
              bg: bento.logo,
              border: bento.logo,
            },
          },
          label: {
            fontWeight: 'normal',
            color: 'gray.800',
            fontSize: 'sm',
            _checked: {
              fontSize: 'sm',
            },
          },
        },
      },
    },
    Switch: {
      defaultProps: {
        variant: 'bento',
      },
      variants: {
        bento: {
          track: {
            _checked: {
              bg: bento.logo,
              border: bento.logo,
            },
          },
        },
      },
    },
    Tab: {
      baseStyle: {
        borderBottomWidth: '4px',
        py: '3',
        textAlign: 'center',
        color: 'blue.800',
        _focus: {
          outline: 0,
        },
        _active: {
          outline: 0,
        },
        _selected: {
          fontWeight: 'bold',
          borderBottomColor: 'b-primary.500',
        },
      },
    },
    Tag: {
      defaultProps: {
        container: {
          bg: 'gray.50',
        },
      },
    },
    Input: {
      defaultProps: {
        variant: 'outline',
      },
      variants: {
        outline: {
          field: {
            borderRadius: 'base',
            bg: 'white',
          },
        },
      },
    },
    Alert: {
      defaultProps: {
        variant: 'solid',
      },
      variants: {
        notice: {
          container: {
            backgroundColor: colors.tip.bg,
            borderRadius: '4px',
          },
          title: {
            color: colors.tip.text,
          },
          description: {
            color: colors.tip.text,
          },
          spinner: {
            color: colors.tip.text,
          },
        },
      },
    },
    Progress: {
      defaultProps: {
        variant: 'default',
      },
      variants: {
        default: {
          track: {
            borderRadius: 'base',
          },
        },
      },
    },
    Radio: {
      defaultProps: {
        variant: 'bento',
      },
      variants: {
        bento: {
          _checked: {
            background: 'bento.logo',
            backgroundColor: 'bento.logo',
            outline: '1px solid gray.200',
            border: '5px solid white',
          },
        },
      },
    },
    Form: {
      baseStyle: (props) => ({
        helperText: {
          mt: '1',
        },
      }),
    },
    FormLabel: {
      baseStyle: {
        fontWeight: 'bold',
        fontSize: 'sm',
        mb: '1',
      },
      variants: {
        secondary: {
          color: 'gray.600',
          fontWeight: 'semibold',
        },
      },
    },
    Modal: {
      baseStyle: {
        header: { fontWeight: 'bold' },
      },
    },
    Button: {
      defaultProps: {
        colorScheme: 'blue',
      },
      variants: {
        solid: {
          bg: 'bento.bright',
          fontWeight: 'bold',
          color: 'white',
          borderRadius: 'base',
          _hover: {
            bg: 'bento.logo',
            _disabled: {
              bg: 'bento.bright',
            },
          },
        },
        ghost: {
          fontWeight: 'semibold',
          color: 'gray.500',
        },
        red: {
          color: 'white',
          bg: 'red.500',
          fontWeight: 'bold',
          borderRadius: 'base',
          _hover: {
            bg: 'red.500',
            opacity: '0.8',
            _disabled: {
              bg: 'red.500',
              opacity: '0.4',
            },
          },
          _active: {
            bg: 'red.500',
            opacity: '0.6',
          },
        },
        outline: {
          bg: 'transparent',
          color: 'bento.bright',
          borderColor: 'bento.bright',
          _hover: {
            bg: 'transparent',
            borderColor: 'bento.logo',
            color: 'bento.logo',
            _disabled: {
              bg: 'bento.bright',
            },
          },
          _active: {
            borderColor: 'bento.logo',
            _bg: 'transparent',
          },
        },
        secondary: {
          color: 'bento.bright',
          fontWeight: 'bold',
          backgroundColor: 'bento.pale',
          _hover: {
            color: 'bento.logo',
            _disabled: {},
          },
        },
        error: {
          color: colors.error.text,
          fontWeight: 'bold',
          backgroundColor: colors.error.bg,
          _hover: {
            color: colors.error.bright,
            _disabled: {},
          },
        },
        link: {
          color: 'bento.bright',
        },
        dropdown: {
          bg: 'white',
          color: 'gray.900',
          borderColor: 'gray.300',
          borderRadius: 'base',
          borderWidth: '1px',
          fontWeight: '400',
          _hover: {
            borderColor: 'gray.400',
            _disabled: {
              bg: 'bento.bright',
            },
          },
          _active: {
            _bg: 'transparent',
            boxShadow: `0 0 0 1.5px #2684ff`,
          },
        },
      },
    },
  },
  fonts: {
    body: 'Open Sans, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    heading:
      'Open Sans, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    mono: 'Menlo, Monaco, Consolas, Courier New, monospace',
  },
  styles: {
    global: {
      body: {
        bg: 'white',
        color: 'gray.900',
        fontSize: 'sm',
        borderColor: 'border',
      },
      fontFamily: 'body',
    },
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
  },
  fontWeights: {
    semibold: 500,
    bold: 600,
  },
  Icon: {
    baseStyle: {
      width: '1',
      height: '1',
    },
  },
  icons: {
    'pencil-create': {
      path: (
        <g fill="currentColor">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            // eslint-disable-next-line max-len
            d="M15.031 3c.546 0 1.069.218 1.45.603l2.585 2.584a2.051 2.051 0 0 1 0 2.901L9.63 18.52c-.582.671-1.407 1.084-2.352 1.149H3v-.834l.003-3.512a3.372 3.372 0 0 1 1.102-2.245l9.474-9.474A2.047 2.047 0 0 1 15.031 3zM7.22 18.004c.445-.032.86-.239 1.192-.62l6.302-6.3-3.129-3.13-6.338 6.337c-.338.299-.547.717-.58 1.099v2.613l2.553.001zm5.544-11.228l3.128 3.129 1.995-1.995a.385.385 0 0 0 0-.545L15.301 4.78a.38.38 0 0 0-.54 0l-1.997 1.997z"
          />
          <path
            // eslint-disable-next-line max-len
            d="M0 0v-.3h-.3V0H0zm20 0h.3v-.3H20V0zm0 20v.3h.3V20H20zM0 20h-.3v.3H0V20zM0 .3h20v-.6H0v.6zM19.7 0v20h.6V0h-.6zm.3 19.7H0v.6h20v-.6zM.3 20V0h-.6v20h.6z"
          />
        </g>
      ),
      viewBox: '0 0 20 20',
    },
  },
  sizes: {
    ...additionalSizes,
  },
  space: {
    ...additionalSizes,
  },
} as RecursivePartial<ThemeExtension>);

/**
 * This type is just string for now, but allows for greater type safety (and type-ahead) in the future
 *
 * Examples:
 *    - 'b-primary.500'
 *    - 'red.300'
 */
export type ColorProp = string;

export default theme;
