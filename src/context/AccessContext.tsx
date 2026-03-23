import React, { createContext, useContext, useMemo, useState } from 'react';

type AccessContextValue = {
  canTransact: boolean;
  setCanTransact: (value: boolean) => void;
};

const AccessContext = createContext<AccessContextValue | null>(null);

export const AccessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [canTransact, setCanTransact] = useState(false);
  const value = useMemo(
    () => ({ canTransact, setCanTransact }),
    [canTransact],
  );
  return (
    <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
  );
};

export function useAccess(): AccessContextValue {
  const ctx = useContext(AccessContext);
  if (!ctx) {
    throw new Error('useAccess must be used within AccessProvider');
  }
  return ctx;
}
