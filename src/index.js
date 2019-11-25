import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from './Store';

import ReactMatrix from './components/ReactMatrix';
import AppStyles from './styles/global.less';

const Main = () => {
  return (
    <StoreProvider>
      <ReactMatrix className={AppStyles.container}/>
    </StoreProvider>
  );
};

ReactDOM.render(<Main />,document.getElementById('react-mount'));
