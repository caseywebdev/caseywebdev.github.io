//= require bower_components/amdainty/amdainty.js
//= requireSelf
//= require ./init.js

import Index from 'components/index';
import React from 'react';

var init = function () {
  React.renderComponent(Index(), document.body);
};

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
