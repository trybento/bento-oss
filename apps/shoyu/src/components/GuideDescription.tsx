import React from 'react';
import { Guide } from 'bento-common/types/globalShoyuState';

const GuideDescription: React.FC<{ guide: Guide | undefined }> = ({ guide }) =>
  guide?.description ? (
    <div className="bento-guide-description text-sm mt-1">
      {guide?.description}
    </div>
  ) : null;
export default GuideDescription;
