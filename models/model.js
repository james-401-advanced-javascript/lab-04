'use strict';

const fs = require('fs');
const util = require('util');
const uuid = require('uuid/v4');
const validator = require('../lib/validator.js');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Model {
  constructor(schema, file) {
    this.schema = schema;
    this.file = file;
    this.database = [];
    this.id = uuid();
  }

  // Initialize the database
  async load() {
    // read the file asynchronously and save the results in
    // contents
    try {
      let contents = await readFile(this.file);

      // .then() (b/c of await)
      this.database = JSON.parse(contents.toString().trim());
      return this.database;
    } catch (e) {
      console.error(e);
    }
  }

  // CRUD: create
  async create(item) {
    // item = the new object we're gonna write to our database

    // first, check that item is the right format
    // check it matches the schema
    // all the required fields are there
    // all the fields are of the right type
    // ... is the spread operator
    // it expands the contents of the variable so that
    // you can copy it into another object/array
    console.log('TEEEEEEAM: ', item);
    let record = { id: uuid(), ...item };
    let isValid = this.sanitize(item);

    if (isValid) {
      // let's create the thing!
      // first, add it to our local database object
      this.database.push(record);

      // write my changed database back to the file
      await writeFile(this.file, JSON.stringify(this.database));

      return record;
    }

    return 'Invalid schema';
  }

  // CRUD: read / search - we don't know if it exists
  async read(key, val) {
    // go through this.database array
    // if the object at this.database[indx] has a key
    // val pair that matches the parameter val
    // return that object

    let found = {};
    console.log('KEY: ', key, 'val: ', val);

    // this is optional, but recommended
    // in case you forgot to load, made some
    // change and didn't update this.database, etc
    await this.load();
    this.database.forEach(item => {
      if (item[key] === val) found = item;
    });
    console.log(found);
    return found;
  }

  // CRUD: update - you usually only update something that exists
  // if something exists, it has an id
  async update(id, item) {
    // change a piece of the data
    // change data where data.id === id
    // [async] write data to file
    // make sure your change is in this.database
    // write this.database to file
    // let updatedItem = {};
    this.database.forEach(entry => {
      if (entry.id === id) {
        entry = { ...item };
      }
    });
    return this.database;
  }

  // CRUD: delete
  async delete(id) {
    // find this.database object where object.id === id (forEach??)
    // remove that object (map??)
    // [async] write the new (smaller) this.database to the file
  }

  // Validation
  sanitize(item) {
    // do something to check that item is valid
    // against this.schema
    let foo = validator.isValid(this.schema, item);
    console.log('TEST: ', foo);
    if (item) {
      return validator.isValid(this.schema, item);
    } else {
      return undefined;
    }
  }
}

module.exports = Model;
