import React, { useLayoutEffect, useRef } from 'react';
import { BENTO_MESSAGE } from './constants';

export default function BentoBacklinkElement() {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.outerHTML = BENTO_MESSAGE;
    }
  }, []);
  return (
    <>
      <span ref={ref} />
      <a href="https://www.trybento.co" className="powered-by-bento hidden">
        Onboarding powered by Bento!
      </a>
    </>
  );
}
