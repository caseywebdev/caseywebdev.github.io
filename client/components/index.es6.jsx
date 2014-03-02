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
    this.createWorld();
    window.addEventListener('resize', this.createWorld);
    window.addEventListener('deviceorientation', this.handleOrientation);
  },

  createWorld: function () {
    if (this.world) this.destroyWorld();
    var gravity = new Box2D.b2Vec2(0, 0);
    this.world = new Box2D.b2World(gravity);
    Box2D.destroy(gravity);
    var wallsBodyDef = new Box2D.b2BodyDef();
    var walls = this.world.CreateBody(wallsBodyDef);
    Box2D.destroy(wallsBodyDef);
    var wallsFixtureDef = new Box2D.b2FixtureDef();
    wallsFixtureDef.set_friction(1);
    wallsFixtureDef.set_restitution(0);
    var width = window.innerWidth;
    var height = window.innerHeight;
    wallsFixtureDef.set_shape(Box2D.CreateLoopShape([
      {x: 0, y: height / config.ptm},
      {x: 0, y: 0},
      {x: width / config.ptm, y: 0},
      {x: width / config.ptm, y: height / config.ptm}
    ]));
    walls.CreateFixture(wallsFixtureDef);
    Box2D.destroy(wallsFixtureDef);

    var scale = Math.min(width, height) / 900;
    this.balls = _.times(Math.floor(scale * 100), function () {
      return this.createBall({
        className: 'gravatar',
        radius: scale * (10 + Math.random() * 40)
      });
    }, this).concat(
      _.map({
        gravatar: 'mailto:c@sey.me',
        facebook: 'https://www.facebook.com/caseywebdev',
        twitter: 'https://twitter.com/caseywebdev',
        github: 'https://github.com/caseywebdev',
        orgsync: 'http://www.orgsync.com/company/team_member/casey-foster'
      }, function (href, className) {
        return this.createBall({
          className: className,
          radius: scale * (className === 'gravatar' ? 200 : 100),
          href: href
        });
      }, this)
    );
  },

  destroyWorld: function () {
    Box2D.destroy(this.world);
    delete this.world;
  },

  createBall: function (options) {
    var bodyDef = new Box2D.b2BodyDef();
    bodyDef.set_type(Box2D.b2_dynamicBody);

    var body = this.world.CreateBody(bodyDef);
    Box2D.destroy(bodyDef);

    var radius = options.radius;
    var pos = body.GetPosition();
    pos.Set(
      (radius + Math.random() * (window.innerWidth - radius * 2)) / config.ptm,
      (radius + Math.random() * (window.innerHeight - radius * 2)) / config.ptm
    );
    body.SetTransform(pos, 0);

    var fixtureDef = new Box2D.b2FixtureDef();
    var circle = new Box2D.b2CircleShape();
    circle.set_m_radius(radius / config.ptm);
    fixtureDef.set_shape(circle);
    fixtureDef.set_density(1);
    fixtureDef.set_friction(1);
    fixtureDef.set_restitution(0.25);
    body.CreateFixture(fixtureDef);
    Box2D.destroy(circle);
    Box2D.destroy(fixtureDef);

    body.options = options;

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
    window.removeEventListener('resize', this.createWorld);
    this.destroyWorld();
  },

  step: function () {
    var now = _.now();
    var dt = (now - this.lastStep) / 1000;
    this.lastStep = now;
    this.world.Step(dt, 8, 3);
    this.stepTimeoutId = setTimeout(this.step, 1000 / config.sps);
  },

  redraw: function () {
    this.forceUpdate();
    this.animationFrameId = requestAnimationFrame(this.redraw);
  },

  handleMouseMove: function (ev) {
    var width = this.getWidth();
    var height = this.getHeight();
    var x = (ev.clientX - (width * 0.5)) / width * config.gravity;
    var y = (ev.clientY - (height * 0.5)) / height * config.gravity;
    this.setGravity(x, y);
  },

  handleOrientation: function (ev) {
    var x = ev.gamma / 90 * config.gravity;
    var y = ev.beta / 180 * config.gravity;
    this.setGravity(x, y);
  },

  getWidth: function () {
    return window.innerWidth;
  },

  getHeight: function () {
    return window.innerHeight;
  },

  setGravity: function (x, y) {
    var gravity = this.world.GetGravity();
    gravity.Set(x, y);
    this.world.SetGravity(gravity);
    _.invoke(this.balls, 'SetAwake', true);
  },

  renderBall: function (ball, i) {
    return (
      <Ball
        key={i}
        x={ball.GetPosition().get_x() * config.ptm}
        y={ball.GetPosition().get_y() * config.ptm}
        angle={ball.GetAngle() / Math.PI * 180}
        radius={ball.options.radius}
        className={ball.options.className}
        href={ball.options.href}
      />
    );
  },

  render: function () {
    return (
      <div
        id='index'
        style={{width: this.getWidth(), height: this.getHeight()}}
        onMouseMove={this.handleMouseMove}
      >
        {this.balls.map(this.renderBall)}
      </div>
    );
  }
});
