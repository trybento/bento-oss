import React from 'react';
import { AtLeast } from '../types';
import Footer from './Footer';
import Layout, { defaultEmailStyles } from './Layout';
import Link from './Link';
import TextBlock from './TextBlock';

interface Props {
  organizationName: string;
  defaultUserNotificationURL: string;
  moduleName: string;
  steps: AtLeast<
    { name: string; isComplete: boolean },
    'name' | 'isComplete'
  >[];
}

const EndUserNudge: React.FC<Props> = ({
  organizationName,
  defaultUserNotificationURL,
  moduleName,
  steps,
}) => {
  return (
    <Layout>
      <TextBlock style={{ paddingTop: 0 }}>Hey there,</TextBlock>
      <TextBlock>
        Congrats on getting started with {organizationName}! We've set up
        in-product guides to show you the fastest path to success.
      </TextBlock>
      <TextBlock>
        You’re currently on the <b>{moduleName}</b> section which contains:
      </TextBlock>

      <ul
        style={{
          listStylePosition: 'inside',
          margin: 0,
          paddingLeft: 0,
          paddingTop: defaultEmailStyles.paddingTop,
        }}
      >
        {steps.map((step) => (
          <li
            style={{
              padding: '3px 0',
              margin: 0,
              textDecoration: step.isComplete ? 'line-through' : undefined,
            }}
          >
            {step.name}
          </li>
        ))}
      </ul>
      <TextBlock>
        Click <Link href={defaultUserNotificationURL}>here</Link> to keep going!
      </TextBlock>
      <Footer>
        You'll only get 1 reminder for each new guide you receive.
      </Footer>
    </Layout>
  );
};

export default EndUserNudge;
