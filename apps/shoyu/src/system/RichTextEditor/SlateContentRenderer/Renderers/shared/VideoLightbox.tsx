import React from 'react';

interface LightboxContainerProps {
  children: any;
  handleClose: () => void;
}

const MAX_EXPANDED_WIDTH_PX = 1280;

const calculateSize = () => {
  let expandedWidth = window.innerWidth * 0.8;
  if (expandedWidth > MAX_EXPANDED_WIDTH_PX) {
    expandedWidth = MAX_EXPANDED_WIDTH_PX;
  }

  let expandedHeight = expandedWidth / (16 / 9);

  if (expandedHeight > window.innerHeight) {
    expandedHeight = window.innerHeight * 0.8;

    expandedWidth = expandedHeight / (16 / 9);
  }

  return [expandedWidth, expandedHeight];
};

const LightboxContainer = ({
  children,
  handleClose,
}: LightboxContainerProps) => {
  const [expandedWidth, expandedHeight] = calculateSize();

  const centerX = window.innerWidth / 2 - expandedWidth / 2;
  const centerY = window.innerHeight / 2 - expandedHeight / 2;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
      @keyframes bentoLightboxFadeIn {
        0% {
          background: rgba(0, 0, 0, 0);
        }
        100% {
          background: rgba(0, 0, 0, 0.6);
        }
      }

      .bento-lightbox-fade-in {
        animation: 300ms cubic-bezier(0.04, 0.62, 0.23, 0.98) 0s 1 bentoLightboxFadeIn;
        animation-fill-mode: forwards;
      }

      @keyframes bentoLightboxVideoOpacity {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      .bento-lightbox-video {
        opacity: 0;
        animation: 300ms cubic-bezier(0.04, 0.62, 0.23, 0.98) 700ms 1 bentoLightboxVideoOpacity;
        animation-fill-mode: forwards;
      }
    `,
        }}
      />
      <div
        className="bento-lightbox-fade-in"
        style={{
          position: 'fixed',
          zIndex: 999999999999999,
          height: '100vh',
          width: '100vw',
          top: 0,
          left: 0,
        }}
        onClick={handleClose}
      >
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            top: centerY,
            left: centerX,
            width: `${expandedWidth}px`,
            height: `${expandedHeight}px`,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default LightboxContainer;
