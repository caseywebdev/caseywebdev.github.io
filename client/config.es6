import _ from 'underscore';
import Box2D from 'box2d';

// Box2D is missing these helpful functions out of the box.
Box2D.CreateVerticesPointer = function (vertices) {
  var ptr = Box2D.allocate(vertices.length * 8, 'float', Box2D.ALLOC_STACK);
  _.each(vertices, function (vertex, i) {
    Box2D.setValue(ptr + (i * 8), vertex.x, 'float');
    Box2D.setValue(ptr + (i * 8) + 4, vertex.y, 'float');
  });
  return Box2D.wrapPointer(ptr, Box2D.b2Vec2);
};

Box2D.CreatePolygonShape = function (vertices) {
  var shape = new Box2D.b2PolygonShape();
  shape.Set(Box2D.CreateVerticesPointer(vertices), vertices.length);
  return shape;
};

Box2D.CreateLoopShape = function (vertices) {
  var shape = new Box2D.b2ChainShape();
  shape.CreateLoop(Box2D.CreateVerticesPointer(vertices), vertices.length);
  return shape;
};

Box2D.CreateChainShape = function (vertices) {
  var shape = new Box2D.b2ChainShape();
  shape.CreateChain(Box2D.CreateVerticesPointer(vertices), vertices.length);
  return shape;
};

export default {

  // Pixels to meters. Drawing uses pixel units, physics uses meters.
  ptm: 20,

  // Steps per second.
  sps: 60,

  // m/s^2
  gravity: 9.8
};
