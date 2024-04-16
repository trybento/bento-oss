# Pontis

This is Bento's chrome extension built with the [Plasmo framework](https://docs.plasmo.com/). It allows users to use Bento’s visual editor to place experiences in your product without engineering.

## Getting Started

First, create an `./env.dev` file off of `./example.env`. Make sure `CRX_PUBLIC_KEY` is populated with a valid key.

Then, run the development server:

```bash
yarn dev
```

Open your browser's extension management panel, and load the appropriate development build from /builds. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

## Making the production build

First, make sure you've bumped the `version` within `package.json` based on the changes made and according to [Semantic Versioning](https://semver.org/).

Now simply run:

```bash
yarn package
```

Once the command finishes, a `build-{date-hour}.zip` file will be created, ready to be published to the store.

## Publish to the store (manually)

Now that you've packaged the new version (and tested things worked as expected), it is time to publish to the store.

First, open the [Chrome Web Store - Developer Dashboard](https://chrome.google.com/u/1/webstore/devconsole).

On the dashboard page, click onto the target item and navigate to the "Package" item within the "Build" section on the sidebar. From there you should be able to see a "Upload new package" button. Click it, and select the .zip file you've previously created.

After the upload is complete, you should be able to go to "Store listing" and press "Submit for review".

## Manifest

Plasmo automatically generates parts of the final `manifest.json` file, but [overrides](https://docs.plasmo.com/framework/customization/manifest) can be found within `package.json`, under the `manifest` key.

### Permissions

#### storage

`storage` access is requested given the browser extension leverages the browser Storage API to persist the data it needs for as long as the browser session lives.

Currently, we mostly persist WYSIWYG and preview data.

#### webNavigation

`webNavigation` access is requested to know when the visual editor is launched, so that data can be synchronized back to Bento's admin interface.
