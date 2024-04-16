const ORGANIZATION = {
  name: 'AcmeCo',
  slug: 'acmeco',
};

const ORGANIZATION_SETTINGS = {
  primaryColorHex: '4242D3',
  secondaryColorHex: 'E7E7F6',
};

const MODULE_NAMES = {
  BASIC_SETUP: 'Salesforce Integration',
  WORKFLOW: 'Create and run your first workflow',
  INTEGRATIONS: 'Connect to your key systems',
};
const MODULES = [
  {
    name: MODULE_NAMES.BASIC_SETUP,
    steps: [
      {
        name: 'Enter the number of Salesforce records below',
        body: `Enter the number of salesforce records below.

![Select](/select.png)`,
        inputType: 'select',
      },
      {
        name: 'Enter your salesforce admin',
        body: `Enter the email of your salesforce admin.

![Text](/text.png)`,
        inputType: 'text',
      },
      {
        name: 'Authenticate',
        body: `Authenticate your salesforce instance`,
      },
    ],
  },
  {
    name: MODULE_NAMES.WORKFLOW,
    steps: [
      {
        name: 'Define key events',
        body: `Here're the key events you want to define so we can do this and that.`,
      },
      {
        name: 'Add triggers',
        body: `Triggers are the logic that let you do this and that. We recommend starting with 1 trigger, specifically a "start' action trigger. Read more here.`,
      },
      {
        name: 'Define actions',
        body: `Choose from our library of actions so you know what needs to happen next.`,
      },
    ],
  },
  {
    name: MODULE_NAMES.INTEGRATIONS,
    steps: [
      {
        name: 'SCIM / SSO',
        body: `Here's a video of how you integrate your SSO with AcmeCo

<iframe width="350" height="260" src="https://www.loom.com/embed/08365a4ca9ea4cc1a03f325a0abd8db5" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

`,
      },
      {
        name: 'HRIS',
        body: `TBD`,
      },
      {
        name: 'CRM',
        body: `TBD`,
      },
      {
        name: 'Data providers',
        body: `TBD`,
      },
    ],
  },
];

const TEMPLATES = [
  {
    name: 'Admin setup',
    description: 'Initial setup to start using AcmeCo for awesome things.',
    modules: [MODULE_NAMES.BASIC_SETUP],
  },
];

module.exports = {
  ORGANIZATION,
  ORGANIZATION_SETTINGS,
  MODULES,
  TEMPLATES,
};
