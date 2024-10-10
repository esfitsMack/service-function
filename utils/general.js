import _ from 'lodash';
// eslint-disable-next-line no-unused-vars
import { Message, Schema } from '@asyncapi/parser';
import { FormatHelpers } from '@asyncapi/modelina';
const contentTypeJSON = 'application/json';
const contentTypeString = 'text/plain';
const contentTypeBinary = 'application/octet-stream';

/**
 * @typedef TemplateParameters
 * @type {object}
 * @property {boolean} generateTestClient - whether or not test client should be generated.
 * @property {boolean} promisifyReplyCallback - whether or not reply callbacks should be promisify.
 */

/**
 * Should the callbacks be promisify.
 *
 * @param {TemplateParameters} params passed to the template
 * @returns {boolean} should it promisify callbacks
 */
export function shouldPromisifyCallbacks(params) {
  return params.promisifyReplyCallback;
}

export function camelCase(string) {
  return _.camelCase(string);
}
export function pascalCase(string) {
  string = _.camelCase(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export function kebabCase(string) {
  return _.kebabCase(string);
}

/** 
* @param {string} infotitle tag from spec file that contains namespace details short names are derived from the namespace
*/
export function funcName(infotitle) {
  let functionname = generateRandomString(24).toLowerCase(); //ensures we return something of the correct length and case at least
  if(infotitle.length > 0)
  {
    infotitle = infotitle.toLowerCase();
    let nameArray = infotitle.split(".");
    if (nameArray.length > 4)
    {
      if(nameArray[3]==="services")
      {
        functionname = nameArray[4];
      }
      else if (nameArray[3]==="api")
      {
        functionname = nameArray[4];
      }
      else if (nameArray[3]==="events")
      {
        if(nameArray.length > 5)
          functionname = nameArray[4] + nameArray[5];
      }
    }
  }
  //ensure length is <= 24
  if (functionname.length > 24)
  {
    functionname = functionname.slice(0,23);
  }

  return functionname;
}

/** 
* @param {string} infotitle tag from spec file that contains namespace details short names are derived from the namespace
*/
export function shortName(infotitle) {

  let shortname = generateRandomString(24).toLowerCase(); //ensures we return something of the correct length and case at least
  if(infotitle.length > 0)
  {
    infotitle = infotitle.toLowerCase();
    let nameArray = infotitle.split(".");
    if(nameArray.length > 3)
    {
      shortname = nameArray[0] + nameArray[1] + nameArray[2] + nameArray[3];
    }
  }
  //make sure we don't go over 24 chars
  if (shortname.length > 24)
  {
    shortname = shortname.slice(0,23);
  }

  return shortname;
}

/** 
* @param {string} infotitle tag from spec file that contains namespace details short names are derived from the namespace
*/
export function className(infotitle) {
  let classname = generateRandomString(24).toLowerCase(); //ensures we return something of the correct length and case at least
  if(infotitle.length > 0)
  {
    let nameArray = infotitle.split(".");
    classname = nameArray[2]+nameArray[4];
  }
  return classname;
}
/** 
* @param {int} myLength how long of a string to return
*/
export function generateRandomString(myLength)
{
  const chars =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const randomArray = Array.from(
    { length: myLength },
    (v, k) => chars[Math.floor(Math.random() * chars.length)]
  );  
  const randomString = randomArray.join("");
  return randomString;
}

/** 
* @param {Array} tags the array of tags from some section of the spec
* @param {string} tagname the name of the tag you want from the array...returns the last match
*/
export function getTagByName(tags, tagname)
{
var target;
tags.forEach(tag => {
if (tag.name === tagname)
  target = tag;
});
  return target;
}

/**
 * Figure out if our message content type or default content type matches a given payload.
 *
 * @param {string} messageContentType to check against payload
 * @param {string} defaultContentType to check against payload
 * @param {string} payload to check
 */
function containsPayload(messageContentType, defaultContentType, payload) {
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (
    (messageContentType !== undefined &&
      messageContentType.toLowerCase() === payload) ||
    (defaultContentType !== undefined && defaultContentType === payload)
  ) {
    return true;
  }
  return false;
}
export function isBinaryPayload(messageContentType, defaultContentType) {
  return containsPayload(messageContentType, defaultContentType, contentTypeBinary);
}
export function isStringPayload(messageContentType, defaultContentType) {
  return containsPayload(messageContentType, defaultContentType, contentTypeString);
}
export function isJsonPayload(messageContentType, defaultContentType) {
  return containsPayload(messageContentType, defaultContentType, contentTypeJSON);
}

/**
 * Checks if the message payload is of type null
 *
 * @param {Schema} messagePayload to check
 * @returns {boolean} does the payload contain null type
 */
export function messageHasNotNullPayload(messagePayload) {
  return `${messagePayload.type()}` !== 'null';
}

/**
 * Get message type ensure that the correct message type is returned.
 *
 * @param {Message} message to find the message type for
 */
export function getMessageType(message) {
  if (`${message.payload().type()}` === 'null') {
    return 'null';
  }
  return `${getSchemaFileName(message.payload().uid())}`;
}

/**
 * Convert JSON schema draft 7 types to csharp types
 * @param {*} jsonSchemaType
 * @param {*} property
 */
export function toCType(jsonSchemaType, property) {
  switch (jsonSchemaType.toLowerCase()) {
  case 'string':
    return 'String';
  case 'integer':
    return 'int';
  case 'number':
    return 'decimal';
  case 'boolean':
    return 'bool';
  case 'object':
    if (property) {
      return `${property.uid()}Schema`;
    }
    return 'object';

  default: return 'object';
  }
}

/**
 * Cast JSON schema variable to csharp type
 *
 * @param {*} jsonSchemaType
 * @param {*} variableToCast
 */
export function castToCType(jsonSchemaType, variableToCast) {
  switch (jsonSchemaType.toLowerCase()) {
  case 'string':
    return `$"{${variableToCast}}"`;
  case 'integer':
    return `int.Parse(${variableToCast})`;
  case 'number':
    return `decimal.Parse(${variableToCast}, System.Globalization.CultureInfo.InvariantCulture)`;
  case 'boolean':
    return `bool.Parse(${variableToCast})`;
  default: throw new Error(`Parameter type not supported - ${  jsonSchemaType}`);
  }
}

