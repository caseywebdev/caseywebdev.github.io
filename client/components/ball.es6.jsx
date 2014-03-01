/** @jsx React.DOM */

import config from 'config';
import React from 'react';

export default React.createClass({
  getStyle: function () {
    var x = this.props.x - (config.ptm * 0.45);
    var y = this.props.y - (config.ptm * 0.45);
    var transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) ' +
      'rotateZ(' + this.props.angle + 'deg)';
    return {
      WebkitTransform: transform,
      MozTransform: transform,
      transform: transform
    };
  },

  render: function () {
    return this.transferPropsTo(
      <div className='ball' style={this.getStyle()}>🐶</div>
    );
  }
});
