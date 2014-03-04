export default {

  // Pixels to meters. Drawing uses pixel units, physics uses meters.
  ptm: 20,

  // Steps per second.
  sps: 60,

  // m/s^2
  gravity: 10 * 9.8,

  velocityIterations: 8,

  positionIterations: 3,

  dimensionScalar: 0.00111,

  colorSpeed: 0.01,

  gravatars: {
    casey:
      'http://gravatar.com/avatar/ca34681a45aff25c58c7c5ce9a8b0a32?s=400',
    facebook:
      'http://gravatar.com/avatar/18a83f753fa76b3ea0d594247f4c93b1?s=200',
    twitter:
      'http://gravatar.com/avatar/2f4a8254d032a8ec5e4c48d461e54fcc?s=200',
    github:
      'http://gravatar.com/avatar/61024896f291303615bcd4f7a0dcfb74?s=200',
    orgsync:
      'http://gravatar.com/avatar/98626506be1ab97cad3db7834d23b6ce?s=200'
  },

  getWidth: function () {
    return window.innerWidth;
  },

  getHeight: function () {
    return window.innerHeight;
  },

  getScale: function () {
    return Math.min(this.getWidth(), this.getHeight()) * this.dimensionScalar;
  }
};
