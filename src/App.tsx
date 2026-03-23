import React from 'react';
import RootNavigator from './navigation';
import { CryptoPricesProvider } from './context/CryptoPricesContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { AccessProvider } from './context/AccessContext';

const App: React.FC = () => {
  return (
    <AccessProvider>
      <CryptoPricesProvider>
        <PortfolioProvider>
          <RootNavigator />
        </PortfolioProvider>
      </CryptoPricesProvider>
    </AccessProvider>
  );
};

export default App;

