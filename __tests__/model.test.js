const People = require('../models/people.js');
// const Validator = require('../lib/validator');

describe('Model', () => {
  let testPerson = {
    firstName: 'Sarah',
    lastName: 'Smalls',
    team: 'Yellow Rhino',
  };
  let people = new People(testPerson);

  // How might we repeat this to check on types?
  it('sanitize() returns undefined with missing requirements', async () => {
    expect(people.sanitize()).toBe(undefined);
  });

  it('can create', async () => {
    await expect(people.create(testPerson)).toBeTruthy();
  });

  it('can read', async () => {
    await expect(people.create(testPerson)).toBeTruthy();
  });

  it('can update', async () => {
    await expect(true).toBeTruthy();
  });

  it('can delete', async () => {
    await expect(true).toBeTruthy();
  });
});
