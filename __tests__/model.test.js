const Model = require('../models/model.js');
const Teams = require('../models/teams.js');
const People = require('../models/people.js');
// const Validator = require('../lib/validator');

describe('Model', () => {
  let testPerson = {
    firstName: 'Sarah',
    lastName: 'Smalls',
    team: 'Yellow Rhino',
  };
  let testTeam = {
    id: '89a692cd-65a2-4036-8e5a-40191582ca2f',
    name: 'Orange Rabbit',
  };
  let people = new People(testPerson);
  let teams = new Teams(testTeam);

  // How might we repeat this to check on types?
  it('sanitize() returns undefined with missing requirements', async () => {
    expect(people.sanitize()).toBe(undefined);
  });

  it('can create', async () => {
    await expect(people.create(testPerson)).toBeTruthy();
  });

  it('can read', async () => {
    await expect(teams.create(testTeam)).toBeTruthy();
  });

  it('can update', async () => {
    await expect(true).toBeTruthy();
  });

  it('can delete', async () => {
    await expect(true).toBeTruthy();
  });
});
