import React, { createContext, useContext, useRef } from 'react';

const PortalRefContext = createContext({
  element: null,
});

export const usePortalRef = () => {
  const { element } = useContext(PortalRefContext);
  const ref = useRef(element || document.body);

  return ref;
};

export const PortalRefProvider: React.FC<{
  root?: HTMLElement;
  children?: React.ReactNode;
}> = ({ root, children }) => {
  return (
    <PortalRefContext.Provider value={{ element: root }}>
      {children}
    </PortalRefContext.Provider>
  );
};
