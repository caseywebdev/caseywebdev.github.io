/** @jsx React.DOM */

import React from 'react';

export default React.createClass({
  getStyle: function () {
    var transform = 'translate3d(' + this.props.x + 'px, ' + this.props.y +
      'px, 0) rotateZ(' + this.props.angle + 'deg)';
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
