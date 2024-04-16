import React from 'react';
import { CalloutTypes } from 'bento-common/types/slate';

interface CalloutNode {
  type: 'callout';
  children: any;
  calloutType: CalloutTypes;
}

interface CalloutProps {
  node: CalloutNode;
  children: any;
}

const TYPE_COLOR = {
  [CalloutTypes.Tip]: '#38A54D',
  [CalloutTypes.Info]: '#3CB8D7',
  [CalloutTypes.Warning]: '#F5A34E',
  [CalloutTypes.Error]: '#DD4949',
  [CalloutTypes.Themeless]: '#7F8891',
};

const TYPE_BG_COLOR = {
  [CalloutTypes.Tip]: '#F1F7F1',
  [CalloutTypes.Info]: '#DEEAF0',
  [CalloutTypes.Warning]: '#FCF7F0',
  [CalloutTypes.Error]: '#FDF6F6',
  [CalloutTypes.Themeless]: '#F7F7F8',
};

const CALLOUT_MARGINS = '1em 0';
const CALLOUT_PADDING = '1em 3em 1em 1em';

export default function Callout({ children, node }: CalloutProps) {
  const { calloutType } = node;
  return (
    <div
      className="bento-callout"
      style={{
        marginLeft: 0,
        marginRight: 0,
        margin: CALLOUT_MARGINS,
        padding: CALLOUT_PADDING,
        borderLeft: `4px solid ${TYPE_COLOR[calloutType]}`,
        backgroundColor: TYPE_BG_COLOR[calloutType],
      }}
    >
      <div style={{ marginTop: '8px' }}>{children}</div>
    </div>
  );
}
