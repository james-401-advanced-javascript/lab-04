'use strict';

const Model = require('./model.js');

class Teams extends Model {
  constructor(file) {
    super(
      {
        id: { required: true, type: 'uuid' },
        name: { required: true, type: 'string' },
      },
      file
    );
  }
}

module.exports = Teams;
