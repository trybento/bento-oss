/* eslint-disable no-undef */

// const csp = {
//   'base-uri': ["'self'"],
//   'object-src': ["'none'"],
//   'style-src': ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
//   'frame-src': [
//     "'self'",
//     'https://fonts.googleapis.com',
//     'https://everboarding.trybento.co',
//     'https://staging-everboarding.trybento.co',
//     'https://www.youtube.com',
//     'https://www.loom.com',
//     'https://fast.wistia.net',
//     'https://play.vidyard.com',
//     'https://calendly.com',
//     'https://player.vimeo.com',
//   ],
//   'child-src': [],
//   'font-src': [
//     "'self'",
//     'https://fonts.gstatic.com',
//     'https://assets.trybento.co',
//     'https://uploads.trybento.co',
//     'https://uploads-staging.trybento.co',
//   ],
//   'default-src': ["'self'"],
//   'script-src': [
//     "'self'",
//     'https://assets.trybento.co',
//     'https://s3-us-west-1.amazonaws.com/assets.trybento.co/',
//     'https://assets.calendly.com',
//     'https://*.zdassets.com',
//     'https://*.zendesk.com',
//     "'unsafe-inline'",
//     "'unsafe-eval'",
//     ...(process.env.NODE_ENV === 'development'
//       ? ['http://localhost:8081', 'http://localhost:8082']
//       : []),
//     ...(process.env.NODE_ENV === 'test'
//       ? ['http://localhost:8091', 'http://localhost:8092']
//       : []),
//   ],
//   'connect-src': [
//     "'self'",
//     'https://udon.trybento.co',
//     'https://staging-udon.trybento.co',
//     'wss://udon.trybento.co',
//     'wss://staging-udon.trybento.co',
//     'https://uploads.trybento.co',
//     'https://s3.us-west-1.amazonaws.com/uploads-staging.trybento.co/',
//     'https://s3.us-west-1.amazonaws.com/uploads.trybento.co/',
//     'https://uploads-trybento-dev.s3.us-west-1.amazonaws.com',
//     'https://assets.trybento.co',
//     'https://vimeo.com',
//     'https://www.loom.com',
//     'https://*.zdassets.com',
//     'https://*.zendesk.com',
//     'wss://*.zendesk.com',
//     ...(process.env.NODE_ENV === 'development'
//       ? [
//           'http://localhost:8081',
//           'http://localhost:8082',
//           'ws://localhost:8081',
//         ]
//       : []),
//     ...(process.env.NODE_ENV === 'test'
//       ? [
//           'http://localhost:8091',
//           'http://localhost:8092',
//           'ws://localhost:8091',
//         ]
//       : []),
//   ],
//   'img-src': ["'self'", 'blob:', 'data:', '*'],
//   'media-src': ["'self'", 'https://assets.trybento.co', 'https://www.loom.com'],
// };

/** @type {import('next/dist/lib/load-custom-routes').Header['headers']} */
const defaultSecurityHeaders = [
  // force HTTPS when not in dev
  ...(process.env.NODE_ENV !== 'development'
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
  // only give away the origin/domain when the user navigates away
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // {
  //   key: 'Content-Security-Policy',
  //   value: Object.entries(csp)
  //     .map(([directive, rules]) => `${directive} ${rules.join(' ')};`)
  //     .join(' '),
  // },
];

/**
 * @type {import('next').NextConfig}
 */
const nextJsConfig = {
  /**
   * Increase this value if there are timeouts during deploy due to
   * build taking too long for static pages. Use this only if needed, consider
   * refactoring imports and verifying that there aren't circular
   * dependencies.
   */
  // staticPageGenerationTimeout: 60,
  productionBrowserSourceMaps: true,
  compiler: {
    relay: {
      src: './',
      language: 'typescript', // or 'javascript`
      artifactDirectory: 'relay-types', // you can leave this undefined if you did not specify one in the `relay.json`
    },
  },
  swcMinify: true,
  experimental: {
    externalDir: true,
    esmExternals: false,
  },
  env: {
    // Make the COMMIT_SHA available to the client so that Sentry events can be
    // marked for the release they belong to. It may be undefined if running
    // outside of Vercel
    NEXT_PUBLIC_COMMIT_SHA: process.env.COMMIT_SHA,
    COMMIT_SHA: process.env.COMMIT_SHA,
    NEXT_PUBLIC_ENV: process.env.NODE_ENV,
  },
  webpack: (config, options) => {
    // Define an environment variable so source code can check whether or not
    // it's running on the server so we can correctly initialize Sentry
    config.plugins.push(
      new options.webpack.DefinePlugin({
        'process.env.NEXT_IS_SERVER': JSON.stringify(
          options.isServer.toString()
        ),
      })
    );
    return config;
  },
  basePath: '',
  typescript: {
    // TODO: REMOVE THIS WHEN WE CLEAN UP OUR TYPESCRIPT
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  headers: async () => [
    { source: '/:path*', headers: defaultSecurityHeaders },
    {
      // disable iframe for everything except `/embed/*`
      source: '/((?!embed/?).*)',
      headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
    },
  ],
  eslint: {
    ignoreDuringBuilds: !!process.env.IS_CI,
  },
};

module.exports = nextJsConfig;
