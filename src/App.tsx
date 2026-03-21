import React from 'react';
import RootNavigator from './navigation';
import { CryptoPricesProvider } from './context/CryptoPricesContext';

const App: React.FC = () => {
  return (
    <CryptoPricesProvider>
      <RootNavigator />
    </CryptoPricesProvider>
  );
};

export default App;

