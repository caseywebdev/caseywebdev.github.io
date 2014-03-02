/** @jsx React.DOM */

import config from 'config';
import React from 'react';

export default React.createClass({
  getStyle: function () {
    var radius = this.props.radius;
    var x = this.props.x - radius;
    var y = this.props.y - radius;
    var transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) ' +
      'rotateZ(' + this.props.angle + 'deg)';
    return {
      WebkitTransform: transform,
      MozTransform: transform,
      transform: transform,
      width: radius * 2,
      height: radius * 2
    };
  },

  render: function () {
    var Tag = this.props.href ? React.DOM.a : React.DOM.div;
    return this.transferPropsTo(
      <Tag className='ball' style={this.getStyle()} />
    );
  }
});
