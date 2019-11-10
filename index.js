'use strict';

const Teams = require('./models/teams.js');
const People = require('./models/people.js');
const Validator = require('./lib/validator.js');
const uuidValidate = require('uuid-validate');

//.  0.    1.      2.     3
// node index.js.  ??    ??
let people = new People(process.argv.slice(2)[0]);
let teams = new Teams(process.argv.slice(3)[0]);

async function loadData() {
  let peopleData = await people.load();
  let teamData = await teams.load();
}

/**
 *
 * @param {object} person
 * @function createPerson
 */
async function createPerson(person) {
  // In order to create a new person
  // check if their team exists
  // if not, create a new team
  let team = await findTeam(person.team);
  // set this new person's team equal to the new
  // team id created
  // finaly, create this person
  if (!team.id) {
    // should we first validate that:
    // person.team exists
    // person.team is NOT a uuid
    if (person.team) {
      if (Validator.isString(person.team)) {
        // create the team
        team = await teams.create({ name: person.team });
      }
    }
  }
  // get that new id
  // create person
  return await people.create({ ...person, team: team.id });
}

/**
 *
 * @param {object} val
 * @function findTeam
 */
async function findTeam(val) {
  // val can be either id or a string
  // shouldn't matter, i should just try to find
  // if that team exists

  let result = {};

  if (Validator.isString(val)) result = await teams.read('name', val);
  else if (uuidValidate(val)) result = await teams.read('id', val);

  return result;
}

/**
 *
 * @param {object} person
 * @function readPerson
 */
async function readPerson(person) {
  // search
  // go through and read the people database
  // find people that match whatever params this function has
  let result = {};

  if (person.id) {
    if (uuidValidate(person.id)) {
      result = await people.read('id', person.id);
    }
  }
  return result;
}

/**
 *
 * @param {uuid} id
 * @param {object} person
 * @function updatePerson
 */
async function updatePerson(id, newPersonData) {
  // call people.update
  // UNLESS
  // did this person change teams?
  // if they did
  // you need to verify the team they are now in exists
  // and you need to verify the team they left still has some people
  let person = {};
  if (uuidValidate(id)) {
    person = await people.read('id', id);
  }
  let team = await findTeam(person.team);

  if (!team.id) {
    // should we first validate that:
    // person.team exists
    // person.team is NOT a uuid
    if (person.team) {
      if (Validator.isString(person.team)) {
        team = await teams.create({ name: person.team });
      }
    }
  }
  return await people.update(person.id, { ...newPersonData });
}

/**
 *
 * @param {object} person
 * @function deletePerson
 */
async function deletePerson(obj) {
  // if you delete a person and their team
  // no longer has people
  // you should delete the team!
  let person = await people.read('firstName', obj.firstName);

  let team = person.team;
  // delete person from db
  return await people.delete(person.id);
  // if no one else left on team, remove team
}

/**
 *
 * @param {object} team
 * @function printTeams
 */
async function printTeams() {
  // for each team
  // print the name
  // print the members of that team
}

/**
 *
 * @function runOperations
 */
async function runOperations() {
  await loadData();
  await createPerson({
    firstName: 'Chingalo',
    lastName: 'Madre',
    team: 'LaFlama Blancas',
  });
}

runOperations();
