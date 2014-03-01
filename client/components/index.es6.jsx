/** @jsx React.DOM */

import _ from 'underscore';
import config from 'config';
import Box2D from 'box2d';
import React from 'react';
import Ball from 'components/ball';

var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;

export default React.createClass({
  componentWillMount: function () {
    this.mouseIsDown = false;
    this.mouseX = this.mouseY = 0;
    var gravity = new Box2D.b2Vec2(0, config.gravity);
    this.world = new Box2D.b2World(gravity);
    Box2D.destroy(gravity);
    var wallsBodyDef = new Box2D.b2BodyDef();
    var walls = this.world.CreateBody(wallsBodyDef);
    Box2D.destroy(wallsBodyDef);
    var wallsFixtureDef = new Box2D.b2FixtureDef();
    wallsFixtureDef.set_friction(1);
    wallsFixtureDef.set_restitution(0);
    wallsFixtureDef.set_shape(Box2D.CreateLoopShape([
      {x: 0, y: 15},
      {x: 0, y: 0},
      {x: 20, y: 0},
      {x: 20, y: 15}
    ]));
    walls.CreateFixture(wallsFixtureDef);
    Box2D.destroy(wallsFixtureDef);

    this.balls = _.times(100, _.partial(this.createBall, 0.45));
    this.balls.push(this.createBall(2));
  },

  createBall: function (radius) {
    var bodyDef = new Box2D.b2BodyDef();
    bodyDef.set_type(Box2D.b2_dynamicBody);

    var body = this.world.CreateBody(bodyDef);
    Box2D.destroy(bodyDef);

    var pos = body.GetPosition();
    pos.Set(Math.random() * 20, Math.random() * 15);
    body.SetTransform(pos, 0);

    var fixtureDef = new Box2D.b2FixtureDef();
    var circle = new Box2D.b2CircleShape();
    circle.set_m_radius(radius);
    fixtureDef.set_shape(circle);
    fixtureDef.set_density(1);
    fixtureDef.set_friction(1);
    fixtureDef.set_restitution(0);
    body.CreateFixture(fixtureDef);
    Box2D.destroy(circle);
    Box2D.destroy(fixtureDef);

    return body;
  },

  componentDidMount: function () {
    this.lastStep = _.now();
    this.step();
    this.redraw();
  },

  componentWillUnmount: function () {
    clearTimeout(this.stepTimeoutId);
    cancelAnimationFrame(this.animationFrameId);
    Box2D.destroy(this.world);
  },

  step: function () {
    var now = _.now();
    var dt = (now - this.lastStep) / 1000;
    this.lastStep = now;
    this.world.Step(dt, 8, 3);
    var body = this.world.GetBodyList();
    while (body.a) {
      var x = body.GetPosition().get_x();
      var y = body.GetPosition().get_y();
      var mX = this.mouseX / config.ptm;
      var mY = this.mouseY / config.ptm;
      var dX = x - mX;
      var dY = y - mY;
      var d = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
      if (d < 5) {
        var vector = new Box2D.b2Vec2((dX / d) * 100, (dY / d) * 100);
        body.ApplyForce(vector, body.GetWorldCenter());
        Box2D.destroy(vector);
      }
      body = body.GetNext();
    }
    this.stepTimeoutId = setTimeout(this.step, 1000 / config.sps);
  },

  redraw: function () {
    this.forceUpdate();
    this.animationFrameId = requestAnimationFrame(this.redraw);
  },

  handleMouseDown: function (ev) {
    this.mouseIsDown = true;
    this.updateMouseCoords(ev);
  },

  updateMouseCoords: function (ev) {
    var el = this.getDOMNode().childNodes[0];
    this.mouseX = ev.pageX - el.offsetLeft;
    this.mouseY = ev.pageY - el.offsetTop;
  },

  handleMouseUp: function () {
    this.mouseIsDown = false;
  },

  renderBall: function (ball, i) {
    var x = ball.GetPosition().get_x() * config.ptm;
    var y = ball.GetPosition().get_y() * config.ptm;
    var angle = ball.GetAngle() / Math.PI * 180;
    return <Ball key={i} x={x} y={y} angle={angle} />;
  },

  render: function () {
    return (
      <div
        id='index'
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.updateMouseCoords}
        onMouseUp={this.handleMouseUp}
      >
        {this.balls.map(this.renderBall)}
      </div>
    );
  }
});
