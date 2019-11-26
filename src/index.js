import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from './Store';

import SpriteAnimator from './components/SpriteAnimator';
import AppStyles from './styles/global.less';

const Main = () => {
  return (
    <StoreProvider>
      <SpriteAnimator className={AppStyles.container} />
    </StoreProvider>
  );
};

ReactDOM.render(<Main />, document.getElementById('react-mount'));
