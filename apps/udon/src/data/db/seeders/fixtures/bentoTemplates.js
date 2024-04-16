const BENTO_DOMAIN =
  process.env.NODE_ENV === 'test'
    ? require('shared/constants').BENTO_DOMAIN
    : 'trybento.co';

const ORGANIZATION = {
  name: 'Bento',
  slug: 'bento',
  domain: BENTO_DOMAIN,
  entityId: '98cb78e2-5c1a-11eb-b79a-8b3a5366d6de',
};

const ORGANIZATION_SETTINGS = {
  primaryColorHex: '4242D3',
  secondaryColorHex: 'E7E7F6',
};

const MODULE_NAMES = {
  CREATE_A_PROJECT: 'Create a project',
  PUBLISH_WEEKLY_UPDATES: 'Publish weekly updates',
  MANAGE_PROJECT_LIFECYCLE: 'Manage your project lifecycle!',
  STAY_ALIGNED: 'Stay aligned',
};
const MODULES = [
  {
    name: MODULE_NAMES.CREATE_A_PROJECT,
    steps: [
      {
        name: 'Connect to Slack',
        body: `Stop losing files shared in Slack! With Bento's Slack integration, you can map one or more channels to a Bento project. Bento will automatically add shared resources to your project and send you a daily digest of what's been added (and changed)!

![Connect Slack](/bentoScreenshots/ConnectSlackModal.png)

If you didn't connect to Slack in the initial flow, you can always do so by clicking on **"Add Item"** from any project's **Resources** tab. We strongly recommend creating a **Slack channel dedicated** to this project. It's a best practice across companies we've worked with, and is a great way to keep conversations focused.

![Add Item](/bentoScreenshots/AddItem.png)`,
      },
      {
        name: 'Create a project',
        body: `Projects are the core organizing model in Bento. A project can be something like a new feature being built, or a company initiative. Bento helps give stakeholders and team members an easy way to understand progress, context, and find key resources.

![Create Project](/bentoScreenshots/CreateProject.png)

A project can be "seeded" by uploading a single file, or connecting to a Slack channel.`,
      },
      {
        name: 'Connect to work apps',
        body: `When you first connect a Slack channel, we'll show you the different work apps that were discovered. Google Drive in particular is a powerful integration: Bento can show you activity and comments on any Google Drive or Figma file, making it a breeze to catch up on recent changes.

![Activity Feed](/bentoScreenshots/ActivityFeed.png)

**Our security posture is to never store your content!** Unfortunately, Google requires that we ask for the permission to download your files. You'll need to grant us that permission so we can show you and your stakeholders file **previews and activity history**. Leave us a comment below if you have any questions!

Lastly, you can always connect to new sources directly from the Resources tab.

![Connect Resource](/bentoScreenshots/ConnectResource.png)`,
      },
    ],
  },
  {
    name: MODULE_NAMES.PUBLISH_WEEKLY_UPDATES,
    steps: [
      {
        name: 'Update banner',
        body: `Bento automatically generates weekly updates pulling in the latest 1-liner, status, and upcoming decisions for your project. Before writing a new update, go ahead and update these fields in the banner.

![Project Banner](/bentoScreenshots/ProjectBanner.png)`,
      },
      {
        name: 'Edit generated content',
        body: `Updates are generated per project. To write an update, head over to the Updates tab in a project and click "Write update".

![Sample Update](/bentoScreenshots/SampleUpdate.png)

You can click into the automatically generated content and edit it. We certainly recommend calling out **blockers** and clearly defining **next steps** so stakeholders have an easy way of figuring out how to engage.`,
      },
      {
        name: 'Publish (to Slack)',
        body: `If you have Slack connected, you can publish these updates directly into one more multiple Slack channels, where they'll show up with easy-to-read formatting.

![Slack Update](/bentoScreenshots/SlackUpdate.png)

If you have issues here, it might be that your Gmail is different from the one in your Slack workspace. Leave a comment below if that's the case along with the email used in your Slack workspace and we'll take care of that for you.`,
      },
    ],
  },
  {
    name: MODULE_NAMES.MANAGE_PROJECT_LIFECYCLE,
    steps: [
      {
        name: 'Create phases',
        body: `"Teams using Bento for long projects want to communicate where in the lifecycle a project is, and what's next. That's why we've created Project Milestones to help you define the most critical phases and their dates.

![Phases Setings](/bentoScreenshots/PhasesSettings.png)

Within each project's settings tab, you can rename milestones, drag and drop them to create the right sequence, and set dates. They'll automatically be reflected in the timeline in your project banner!

![Timeline Banner](/bentoScreenshots/TimelineBanner.png)`,
      },
      {
        name: 'Kick off a phase',
        body: `"When you've reached a milestone, click into the circle to mark it as complete. From here, you can even push back future dates automatically if there are delays!

![Phase Kickoff](/bentoScreenshots/PhaseKickOff.png)

We recommend attaching a couple of key resources associated with this milestone so new teammates can reference what was critical for each moment of the project. Plus, they'll automatically be added to your project resources if they're new, and be hyperlinked in the milestone update announcement.

![Phase Resource](/bentoScreenshots/AddPhaseResource.png)`,
      },
    ],
  },
  {
    name: MODULE_NAMES.STAY_ALIGNED,
    steps: [
      {
        name: 'Check out activity feed',
      },
      {
        name: 'Add resource to phase',
      },
      {
        name: 'Read prior updates',
      },
      {
        name: 'Browse company projects',
      },
    ],
  },
];

const TEMPLATES = [
  {
    name: 'Project lead',
    description:
      'Onboard project leads to organize project resources, updates, and activity.',
    modules: [
      MODULE_NAMES.CREATE_A_PROJECT,
      MODULE_NAMES.PUBLISH_WEEKLY_UPDATES,
    ],
  },
  {
    name: 'Team member',
    description:
      'Onboard project contributors to navigate their resources and updates effectively.',
    modules: [MODULE_NAMES.STAY_ALIGNED],
  },
  {
    name: 'Stakeholder',
    description:
      'Onboard stakeholders to navigate resources and updates to remain aligned.',
    modules: [MODULE_NAMES.STAY_ALIGNED],
  },
];

module.exports = {
  ORGANIZATION,
  ORGANIZATION_SETTINGS,
  MODULES,
  TEMPLATES,
};
