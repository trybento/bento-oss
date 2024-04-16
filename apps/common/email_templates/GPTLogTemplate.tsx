import React from 'react';

import { formatDate } from 'bento-common/utils/dates';

export type GptDataRow = {
  date: Date;
  orgName: string;
  templateName: string;
  requester: string;
  prompt: string | null;
  gptOutput: object;
  generateTime: number | null;
};

interface Props {
  data: GptDataRow[];
}

interface SectionProps {
  title: string;
}

const Section: React.FC<React.PropsWithChildren<SectionProps>> = ({
  title,
  children,
}) => (
  <div>
    <h4>{title}</h4>
    {children}
  </div>
);

const GPTLogTemplate: React.FC<Props> = ({ data = [] }) => {
  return (
    <html>
      <head>
        <title>GPT Targeting log</title>
      </head>
      <body>
        <section style={{ fontFamily: 'monospace', padding: '1em' }}>
          <h1>GPT call log</h1>
          <span>Showing {data.length} most recent results</span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '1em',
            }}
          >
            {data.map((d) => {
              const dString = formatDate(d.date);

              return (
                <div
                  key={dString}
                  style={{
                    marginBottom: '1em',
                    padding: '1em',
                    border: '1px solid gray',
                  }}
                >
                  <h3>
                    {dString} "{d.templateName ?? 'Unknown template'}" -{' '}
                    <span style={{ fontSize: '0.7em', color: 'gray' }}>
                      Requested by: {d.requester} @ {d.orgName}
                    </span>
                  </h3>
                  <Section title="Prompt">{d.prompt}</Section>
                  <Section title="Response">
                    {JSON.stringify(d.gptOutput ?? {}, null, 2)}
                  </Section>
                  <Section title="Generation time">
                    {d.generateTime ?? 'unknown'} ms
                  </Section>
                </div>
              );
            })}
          </div>
        </section>
      </body>
    </html>
  );
};

export default GPTLogTemplate;
