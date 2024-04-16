import React from 'react';

import AppWrapper from 'layouts/AppWrapper';
import Box from 'system/Box';

export default function BentoOnboardingGuidePage() {
  return (
    <AppWrapper>
      <Box
        id="home-container"
        maxWidth={1600}
        className="grid grid-cols-12 gap-10 pt-4 px-8"
      >
        <Box id="home-main-col" className="col-span-9 grid gap-10">
          <Box id="home-main-col-first-row"></Box>
          <Box id="home-main-col-second-row" className="flex gap-x-4">
            <div className="first-col w-full"></div>
            <div className="second-col w-full"></div>
            <div className="third-col w-full"></div>
          </Box>
          <Box id="home-main-col-third-row"></Box>
        </Box>
        <Box id="home-side-col" className="col-span-3"></Box>
      </Box>
    </AppWrapper>
  );
}
