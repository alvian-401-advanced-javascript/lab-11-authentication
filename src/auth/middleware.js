'use strict';

const User = require('./users-model.js');
/**
 *exports authorization middleware
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns authBasic(encodedString)
 */
module.exports = (req, res, next) => {

  try {

    let [authType, encodedString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(encodedString);
      default:
        return _authError();
    }

  } catch(e) {
    return _authError();
  }
/**
 *
 *
 * @param {*} authString
 * @returns authenticated user
 */
function _authBasic(authString) {
    let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    let auth = {username,password};  // {username:"john", password:"mysecret"}

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }
/**
 *if user is valid
 *sets user to req header
 generates user token and sets to req header
 * @param {*} user
 */
function _authenticate(user) {
    if ( user ) {
      console.log('user', user);
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }
/**
 *if username or password is invalid
 *
 */
function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

