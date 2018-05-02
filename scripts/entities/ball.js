import _ from 'underscore';
import Box2D from '../box2d';
import config from '../config';
import PIXI from 'pixi';

export default class {
  constructor(options) {
    this.world = options.world;
    this.radius = options.radius;
    this.image = options.image;
    this.url = options.url;
    this.b2 = this.createB2();
    this.sprite = this.createSprite();
  }

  createB2() {
    var bodyDef = new Box2D.b2BodyDef();
    bodyDef.set_type(Box2D.b2_dynamicBody);

    var b2 = this.world.b2.CreateBody(bodyDef);
    Box2D.destroy(bodyDef);

    var radius = this.radius;
    var pos = b2.GetPosition();
    pos.Set(
      (radius + Math.random() * (config.getWidth() - radius * 2)) / config.ptm,
      (radius + Math.random() * (config.getHeight() - radius * 2)) / config.ptm
    );
    b2.SetTransform(pos, 0);

    var fixtureDef = new Box2D.b2FixtureDef();
    // var circle = new Box2D.b2CircleShape();
    // circle.set_m_radius(radius / config.ptm);
    var circle = new Box2D.b2PolygonShape();
    circle.SetAsBox(this.radius / config.ptm, this.radius / config.ptm);
    fixtureDef.set_shape(circle);
    fixtureDef.set_density(1);
    fixtureDef.set_friction(1);
    fixtureDef.set_restitution(0.25);
    b2.CreateFixture(fixtureDef);
    Box2D.destroy(circle);
    Box2D.destroy(fixtureDef);

    return b2;
  }

  createSprite() {
    // var container = new PIXI.DisplayObjectContainer();

    // var mask = new PIXI.Graphics();
    // mask.beginFill(0x000000);
    // mask.drawCircle(0, 0, this.radius);
    // mask.endFill();
    // container.addChild(mask);

    var sprite = PIXI.Sprite.fromImage(this.image);
    // sprite.mask = mask;
    sprite.anchor.x = sprite.anchor.y = 0.5;
    sprite.width = sprite.height = this.radius * 2;
    if (this.url) {
      // mask.hitArea = new PIXI.Circle(0, 0, this.radius);
      sprite.setInteractive(true);
      sprite.click = sprite.tap = _.bind(location.assign, location, this.url);
    }

    // container.addChild(sprite);
    return sprite;
  }

  destroy() {
    this.world.b2.DestroyBody(this.b2);
  }

  updateSprite() {
    var position = this.b2.GetPosition();
    this.sprite.position.x = position.get_x() * config.ptm;
    this.sprite.position.y = position.get_y() * config.ptm;
    this.sprite.rotation = this.b2.GetAngle();
  }
}
