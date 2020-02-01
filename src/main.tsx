import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';

import '@trutoo/ui-core/dist/components/Container/Container.css';
import '@trutoo/ui-core/dist/components/Grid/Grid.css';

import 'index.css';

import { Tapp } from './Tapp/Tapp';

const tapp = () => (
  <Tapp name={hook} config={window.tappConfigs ? window.tappConfigs[hook] || window.tappConfigs[weakHook] || {} : {}} />
);

/* Render hook for multiple of same the tapp */
document.querySelectorAll(`.${hook}`).forEach(element => {
  if (window.shouldRender) {
    ReactDOM.render(tapp(), element);
  } else {
    ReactDOM.hydrate(tapp(), element);
  }
});

export default hot(tapp);
