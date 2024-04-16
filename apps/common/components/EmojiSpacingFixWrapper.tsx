import React, { useMemo } from 'react';
import emojiRegex from 'emoji-regex';

const regex = emojiRegex();
const regexWithDelimiter = new RegExp(`(${regex})`, 'g');

// Used for emoji spacing in mac using non-retina screens.
const EmojiSpacingFixWrapper: React.FC<{ text?: string }> = ({ text }) => {
  const { isMac, isNonRetinaScreen } = useMemo(() => {
    if (!window) return { isMac: false, isNonRetinaScreen: true };
    const isMac = navigator.userAgent.includes('Mac');
    const isNonRetinaScreen = window.devicePixelRatio === 1;
    return { isMac, isNonRetinaScreen };
  }, [window]);

  return isMac && isNonRetinaScreen ? (
    <>
      {(text?.split(regexWithDelimiter) || []).map((subText, i) =>
        regex.test(subText) ? (
          <span style={{ marginRight: '4px' }} key={`${subText}-${i}`}>
            {subText}
          </span>
        ) : (
          subText
        )
      )}
    </>
  ) : (
    <span>{text}</span>
  );
};

export default EmojiSpacingFixWrapper;
