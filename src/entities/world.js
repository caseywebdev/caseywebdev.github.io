import _ from 'underscore';
import herit from 'herit';

import Box2D from '../box2d.js';
import config from '../config.js';

import Ball from './ball.js';

export default herit({
  constructor: function(options) {
    this.container = options.container;
    this.b2 = this.createB2();
    this.walls = this.createWalls();
    this.balls = this.createBalls();
  },

  createB2: function() {
    var gravity = new Box2D.b2Vec2(0, 9.8);
    var b2 = new Box2D.b2World(gravity);
    Box2D.destroy(gravity);
    return b2;
  },

  createWalls: function() {
    var wallsBodyDef = new Box2D.b2BodyDef();
    var walls = this.b2.CreateBody(wallsBodyDef);
    Box2D.destroy(wallsBodyDef);
    var wallsFixtureDef = new Box2D.b2FixtureDef();
    wallsFixtureDef.set_friction(1);
    wallsFixtureDef.set_restitution(0);
    var width = config.getWidth();
    var height = config.getHeight();
    wallsFixtureDef.set_shape(
      Box2D.CreateLoopShape([
        { x: 0, y: height / config.ptm },
        { x: 0, y: 0 },
        { x: width / config.ptm, y: 0 },
        { x: width / config.ptm, y: height / config.ptm }
      ])
    );
    walls.CreateFixture(wallsFixtureDef);
    Box2D.destroy(wallsFixtureDef);
    return walls;
  },

  removeWalls: function() {
    this.b2.DestroyBody(this.walls);
  },

  createBalls: function() {
    var scale = config.getScale();
    return _.times(
      Math.floor(scale * 20),
      function() {
        return this.createBall({
          image: config.links.casey.image,
          radius: scale * (25 + Math.random() * 25)
        });
      },
      this
    ).concat(
      _.map(
        config.links,
        function(link, name) {
          return this.createBall({
            image: link.image,
            radius: scale * (name === 'casey' ? 200 : 100),
            url: link.url
          });
        },
        this
      )
    );
  },

  createBall: function(options) {
    var ball = new Ball(_.extend({ world: this }, options));
    this.container.addChild(ball.sprite);
    return ball;
  },

  removeBall: function(ball) {
    ball.destroy();
    this.container.removeChild(ball.sprite);
  },

  setGravity: function(x, y) {
    var gravity = this.b2.GetGravity();
    gravity.Set(x, y);
    this.b2.SetGravity(gravity);
    _.invoke(_.pluck(this.balls, 'b2'), 'SetAwake', true);
  },

  resize: function() {
    this.removeWalls();
    this.walls = this.createWalls();
    _.each(this.balls, this.removeBall, this);
    this.balls = this.createBalls();
  },

  step: function(dt) {
    this.b2.Step(dt, config.velocityIterations, config.positionIterations);
    _.invoke(this.balls, 'updateSprite');
  }
});
