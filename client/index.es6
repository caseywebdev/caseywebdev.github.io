//= require bower_components/amdainty/amdainty.js
//= requireSelf
//= require ./init.js

import _ from 'underscore';
import config from 'config';
import PIXI from 'pixi';
import World from 'entities/world';

var app = {
  frame: 0,

  init: function () {

    // Switch to autoDetectRenderer once webgl/mask bug is fixed.
    app.renderer =
      PIXI.autoDetectRenderer(config.getWidth(), config.getHeight()),
    app.stage = new PIXI.Stage(app.bkgColor, true),
    app.renderTexture =
      new PIXI.RenderTexture(config.getWidth(), config.getHeight());
    app.renderTexture2 =
      new PIXI.RenderTexture(config.getWidth(), config.getHeight());
    app.bkg = new PIXI.Graphics();
    app.bkg.beginFill(app.bkgColor());
    app.bkg.drawRect(0, 0, config.getWidth(), config.getHeight());
    app.bkg.endFill();
    app.stage.addChild(app.bkg);
    app.echo = new PIXI.Sprite(app.renderTexture);
    app.echo.position.x = config.getWidth() / 2;
    app.echo.position.y = config.getHeight() / 2;
    app.echo.anchor.x = app.echo.anchor.y = 0.5;
    app.stage.addChild(app.echo);
    document.body.appendChild(app.renderer.view);
    app.world = new World({container: app.stage});
    app.lastStep = _.now();
    app.step();
    app.render();
    window.addEventListener('resize', app.resize);
    window.addEventListener('mousemove', app.handleMouseMove);
    window.addEventListener('deviceorientation', app.handleDeviceOrientation);
  },

  resize: function () {
    app.renderTexture.resize(config.getWidth(), config.getHeight());
    app.renderTexture2.resize(config.getWidth(), config.getHeight());
    app.renderer.resize(config.getWidth(), config.getHeight());
    app.echo.position.x = config.getWidth() / 2;
    app.echo.position.y = config.getHeight() / 2;
    app.world.resize();
  },

  step: function () {
    var now = _.now();
    var dt = (now - app.lastStep) / 1000;
    app.lastStep = now;
    app.world.step(dt);
    app.stepTimeoutId = setTimeout(app.step, 1000 / config.sps);
  },

  bkgColor: function () {
    var thirdPi = Math.PI / 3;
    var i = app.frame * config.colorSpeed;
    var red = Math.sin(i) * 127 + 128;
    var green = Math.sin(i + 2 * thirdPi) * 127 + 128;
    var blue = Math.sin(i + 4 * thirdPi) * 127 + 128;
    return (red << 16) + (green << 8) + blue;
  },

  render: function () {
    ++app.frame;
    var temp = app.renderTexture;
    app.renderTexture = app.renderTexture2;
    app.renderTexture2 = temp;
    app.echo.setTexture(app.renderTexture);
    app.echo.rotation += 0.0001;
    app.echo.scale.x = app.echo.scale.y = 0.99;
    app.renderTexture2.render(app.stage, new PIXI.Point(0, 0), true);
    app.renderer.render(app.stage);
    app.bkg.clear();
    app.bkg.beginFill(app.bkgColor());
    app.bkg.drawRect(0, 0, config.getWidth(), config.getHeight());
    app.bkg.endFill();
    app.renderAnimationFrameId = window.requestAnimationFrame(app.render);
  },

  handleMouseMove: function (ev) {
    var width = config.getWidth();
    var height = config.getHeight();
    var gravity = config.getScale() * config.gravity;
    var x = (ev.clientX - (width * 0.5)) / width * gravity;
    var y = (ev.clientY - (height * 0.5)) / height * gravity;
    app.world.setGravity(x, y);
  },

  handleDeviceOrientation: function (ev) {
    var gravity = config.getScale() * config.gravity;
    var x = ev.gamma / 90 * gravity;
    var y = ev.beta / 180 * gravity;
    app.world.setGravity(x, y);
  }
};

if (document.readyState !== 'loading') app.init();
else document.addEventListener('DOMContentLoaded', app.init);

export default app;
