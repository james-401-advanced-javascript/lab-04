const People = require('../models/people.js');
const Teams = require('../models/teams');
const Validator = require('../lib/validator');
const uuidValidate = require('uuid-validate');

describe('Model', () => {
  let testPerson = {
    firstName: 'Sarah',
    lastName: 'Smalls',
    team: 'Yellow Rhino',
  };
  let person = new People(testPerson);

  // How might we repeat this to check on types?
  it('sanitize() returns undefined with missing requirements', async () => {
    expect(person.sanitize()).toBe(undefined);
  });

  it('can create a person in the file', async () => {
    await expect(person.create(testPerson)).toBeTruthy();
  });

  it('can read a person from a file', async () => {
    let readPerson = await person.read();
    await expect(readPerson).toBeTruthy();
  });

  it('can update a person in the file', async () => {
    let testCase = await person.create({
      firstName: 'second',
      lastName: 'test',
      team: 'Black Panthers',
    });
    await person.update(testCase.id, { firstName: 'successful' });
    expect(testCase).toBeTruthy();
    expect(testCase.firstName).toBe('successful');
  });

  it('can delete a person in the file', async () => {
    let testCase = await person.create({
      firstName: 'Deletion',
      lastName: 'Test',
      team: 'Black Panthers',
    });
    await person.delete(testCase.id);
    let emptyDBRequest = await person.read('firstName', 'Deletion');
    expect(emptyDBRequest).toBe('Item not found!');
  });

  it('expects person.id to be UUID', () => {
    expect(uuidValidate(person.id)).toBe(true);
  });
});

describe('The functionality of validator', () => {
  it('validates a string', () => {
    expect(Validator.isString('teststring')).toBe(true);
  });
  it('validates a number', () => {
    expect(Validator.isNumber(6)).toBe(true);
  });
  it('validates a boolean', () => {
    expect(Validator.isBoolean(true)).toBe(true);
  });
  it('validates an object', () => {
    expect(Validator.isObject({ prop: 'teststring' })).toBe(true);
  });
  it('validates an array', () => {
    expect(Validator.isArray([0, 1, 2])).toBe(true);
  });
  it('validates a function', () => {
    expect(Validator.isFunction(() => {})).toBe(true);
  });
  it('validates an array', () => {
    expect(Validator.isArray([0, 1, 2])).toBe(true);
  });
  it('validates an truthy object', () => {
    expect(Validator.isTruthy(true)).toBe(true);
  });
  it('validates a variable data type', () => {
    expect(Validator.isCorrectType(true)).toBe(true);
    expect(Validator.isCorrectType(6)).toBe(true);
    expect(Validator.isCorrectType('true')).toBe(true);
    expect(Validator.isCorrectType(() => {})).toBe(true);
    expect(Validator.isCorrectType([])).toBe(true);
    expect(Validator.isCorrectType({})).toBe(true);
  });
  it('validates a UUID', async () => {
    let team = new Teams({});
    let newTeam = await team.create({ name: 'Black Mambas' });
    let valid = Validator.isValid(team.schema, newTeam);
    expect(valid).toBe(true);
    expect(Validator.isUUID(newTeam.id)).toBe(true);
  });
});
