'use strict';

const uuidValidate = require('uuid-validate');

let validator = {};

/**
 * Based on a set of rules, is the input valid?
 * TODO: Define the rules ... how do we send them in? How do we identify?
 * @param input
 * @param rules
 * @returns {boolean}
 */
// validator.isValid = (input, rules) => {
//   return true;
// };

/**
 * Is this a string?
 * @param input
 * @returns {boolean}
 */
validator.isString = input => {
  return typeof input === 'string';
};

validator.isUUID = input => {
  return uuidValidate(input, 4);
};

validator.isObject = input => {
  return typeof input === 'object' && !(input instanceof Array);
};

validator.isArray = (input, valueType) => {
  return (
    Array.isArray(input) &&
    (valueType ? input.every(val => typeof val === valueType) : true)
  );
};

validator.isBoolean = input => {
  return typeof input === 'boolean';
};

validator.isNumber = input => {
  return typeof input === 'number';
};

validator.isFunction = input => {
  return typeof input === 'function';
};

validator.isTruthy = input => {
  return !!input;
};

validator.isCorrectType = (input, field) => {
  switch (input.constructor.name || field.type) {
  case 'String':
    return validator.isString(input);
  case 'Number':
    return validator.isNumber(input);
  case 'Array':
    return validator.isArray(input);
  case 'Object':
    return validator.isObject(input);
  case 'Boolean':
    return validator.isBoolean(input);
  case 'Function':
    return validator.isFunction(input);
  default:
    return false;
  }
};

validator.isValid = (schema, data) => {
  let valid = true;

  for (let fieldName in schema.fields) {
    let field = schema.fields[fieldName];

    // Am I required and set?
    let required = field.required ? validator.isTruthy(data[fieldName]) : true;

    // Am I the right type (if we even care)
    let type = field.type
      ? validator.isCorrectType(data[fieldName], field)
      : true;

    // If anything is false ...
    if (!(required && type)) {
      valid = false;
    }
  }

  return valid;
};

module.exports = validator;
