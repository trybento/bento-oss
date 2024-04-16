import React from 'react';

import BentoLogo from '../icons/BentoLogo';

export type BuiltWithBentoProps = {
  /** Which URL this should open on click */
  href: string;
};

const BuiltWithBento = ({ href }: BuiltWithBentoProps) => {
  return (
    <a
      className="flex flex-row gap-1 items-center cursor-pointer no-underline opacity-70 hover:opacity-100"
      href={href}
      target="_blank"
    >
      <BentoLogo className="flex w-4 h-4" />
      <span className="flex text-sm">Built with Bento</span>
    </a>
  );
};

export default BuiltWithBento;
