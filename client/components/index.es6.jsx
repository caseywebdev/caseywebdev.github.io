/** @jsx React.DOM */

import _ from 'underscore';
import config from 'config';
import Box2D from 'box2d';
import PIXI from 'pixi';
import React from 'react';

var requestAnimationFrame = window.requestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame;

export default React.createClass({
  componentWillMount: function () {
    this.mouseIsDown = false;
    this.mouseX = this.mouseY = 0;
    this.renderer = new PIXI.autoDetectRenderer(400, 300);
    this.stage = new PIXI.Stage(0xFFFF00);
    this.container = new PIXI.DisplayObjectContainer();
    this.bodies = [];
    var gravity = new Box2D.b2Vec2(0, config.gravity);
    window.world = this.world = new Box2D.b2World(gravity);
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

    _.times(100, function () {
      var bodyDef = new Box2D.b2BodyDef();
      bodyDef.set_type(Box2D.b2_dynamicBody);
      var body = this.body = this.world.CreateBody(bodyDef);
      Box2D.destroy(bodyDef);
      var gfx = new PIXI.Graphics();
      var pos = body.GetPosition();
      pos.Set(Math.random() * 20, Math.random() * 15);
      body.SetTransform(pos, 0);
      var linearVelocity = new Box2D.b2Vec2(
        -10 + Math.random() * 20,
        -10 + Math.random() * 20
      );
      body.SetLinearVelocity(linearVelocity);
      var fixtureDef = new Box2D.b2FixtureDef();
      var box = new Box2D.b2PolygonShape();
      box.SetAsBox(1, 1);
      var circle = new Box2D.b2CircleShape();
      circle.set_m_radius(.5);
      fixtureDef.set_shape(circle);
      // fixtureDef.set_shape(box);
      fixtureDef.set_density(1);
      fixtureDef.set_friction(1);
      fixtureDef.set_restitution(0);
      body.CreateFixture(fixtureDef);
      Box2D.destroy(fixtureDef);

      gfx.beginFill(Math.random() * 0xFFFFFF);
      // gfx.drawRect(
      //   -1 * config.ptm,
      //   -1 * config.ptm,
      //   2 * config.ptm,
      //   2 * config.ptm
      // );
      gfx.drawEllipse(0, 0, .5 * config.ptm, .5 * config.ptm);
      gfx.lineStyle(2, Math.random() * 0xFFFFFF);
      gfx.moveTo(0, 0);
      gfx.lineTo(.5 * config.ptm, 0);

      this.container.addChild(gfx);

      this.bodies.push({b2: body, pixi: gfx});
    }, this);

    // var dog = new PIXI.Graphics();
    // dog.beginFill(Math.random() * 0xFFFFFF);
    // // gfx.drawRect(
    // //   -1 * config.ptm,
    // //   -1 * config.ptm,
    // //   2 * config.ptm,
    // //   2 * config.ptm
    // // );
    // dog.drawEllipse(0, 0, 1 * config.ptm, 1 * config.ptm);
    // dog.lineStyle(2, Math.random() * 0xFFFFFF);
    // dog.moveTo(0, 0);
    // dog.lineTo(1 * config.ptm, 0);
    // this.container.addChild(dog);

    this.stage.addChild(this.container);
  },

  componentDidMount: function () {
    this.getDOMNode().appendChild(this.renderer.view);
    this.lastStep = Date.now();
    this.step();
    this.redraw();
  },

  componentWillUnmount: function () {
    clearTimeout(this.stepTimeoutId);
    cancelAnimationFrame(this.animationFrameId);
  },

  step: function () {
    var now = Date.now();
    var dt = (now - this.lastStep) / 1000;
    this.lastStep = now;
    this.world.Step(dt, 8, 3);
    // if (this.mouseIsDown) {
    //   var mX = this.mouseX / config.ptm;
    //   var mY = this.mouseY / config.ptm;
    //   var dX = x - mX;
    //   var dY = y - mY;
    //   var d = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    //   var vector = new Box2D.b2Vec2(-(dX / d) * 100, -(dY / d) * 100);
    //   body.b2.ApplyForce(vector, body.b2.GetWorldCenter());
    //   Box2D.destroy(vector);
    // }
    // this.dog.position.x = this.mouseX;
    // this.dog.position.y = this.mouseY;
    _.each(this.bodies, function (body) {
      var x = body.b2.GetPosition().get_x();
      var y = body.b2.GetPosition().get_y();
      var mX = this.mouseX / config.ptm;
      var mY = this.mouseY / config.ptm;
      var dX = x - mX;
      var dY = y - mY;
      var d = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
      if (d < 5) {
        var vector = new Box2D.b2Vec2((dX / d) * 100, (dY / d) * 100);
        body.b2.ApplyForce(vector, body.b2.GetWorldCenter());
        Box2D.destroy(vector);
      }
      body.pixi.position.x = x * config.ptm;
      body.pixi.position.y = y * config.ptm;
      body.pixi.rotation = body.b2.GetAngle();
    }, this);
    this.stepTimeoutId = setTimeout(this.step, 1000 / config.sps);
  },

  redraw: function () {
    this.renderer.render(this.stage);
    this.animationFrameId = requestAnimationFrame(this.redraw);
  },

  onMouseDown: function (ev) {
    this.mouseIsDown = true;
    this.updateMouseCoords(ev);
  },

  updateMouseCoords: function (ev) {
    var el = this.getDOMNode().childNodes[0];
    this.mouseX = ev.pageX - el.offsetLeft;
    this.mouseY = ev.pageY - el.offsetTop;
  },

  onMouseUp: function () {
    this.mouseIsDown = false;
  },

  render: function () {
    return (
      <div
        className='physics'
        onMouseDown={this.onMouseDown}
        onMouseMove={this.updateMouseCoords}
        onMouseUp={this.onMouseUp}
      />
    );
  }
});
