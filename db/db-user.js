'use strict';

/**
*
* KEY
*
* Status Codes:
*   'success'  - The operation/request was carried out successfully.
*   'fail'     - The operation/request completed successfully, but was unable to find the desired data.
*   'error'    - The operation/request encountered error(s) and was not able to successfully complete the operation/request.
*   'empty'    - The operations/requests result contained nothing and as is therefore empty.
*   'exists'   - The operations/requests result contained result(s) and therefore exists.
*/

//------------- GLOBAL VARIABLES -------------//
const config = require('../config.js');

/**
* createUser(data) -
* Creates a new record for a new user in the 'userDetails' table and a new cookie in the 'userCookie' table.
* @param {JSON} data The users details
* @return {JSON} A status code or a status code with an error message
*/
module.exports.createUser = async (data) => {
    try {
      const sql = await config.sqlPromise;
      const newRecord = {
        user_id: data.id,
        user_email: data.email,
        user_name: data.name,
        user_picture: data.picture
      };
      const newCookie = {
        user_id: data.id,
        cookie_data: ''
      };
      await sql.query(sql.format('INSERT INTO userDetails SET ?', newRecord));
      await sql.query(sql.format('INSERT INTO userCookies SET ?', newCookie));
      return { status: 'success' };
    } catch (e) {
      console.log(e);
      return { status: 'error', error: e };
    }
  };

/**
* updateUserRecord(data) -
* Updates a users record in the 'userDetails' table.
* @param {JSON} data The users details to be updated
* @return {JSON} A status code or a status code with an error message
*/
module.exports.updateUserRecord = async (data) => {
    try {
      const sql = await config.sqlPromise;
  
      const [result] = await sql.query(sql.format('Select * FROM userDetails WHERE user_id = ?', [data.id]));
  
      if (result.length === 1) {
        await sql.query(sql.format('UPDATE userDetails SET user_email = ?,  user_name = ?, user_picture = ? WHERE user_id = ?', [data.email, data.name, data.picture, data.id]));
      } else {
        return { status: 'empty' };
      }
    } catch (e) {
      console.log(e)
      return { status: 'error', error: e };
    }
  };

  /**
* getUserRecord(userId) -
* Gets a users record from the 'userDetails' table.
* @param {JSON} userId The users id
* @return {JSON} A status code and the users record or a status code or a status code with an error message
*/
module.exports.getUserRecord = async (userId) => {
    try {
      const sql = await config.sqlPromise;
      const [result] = await sql.query(sql.format('SELECT * FROM userDetails WHERE user_id = ?', [userId]));
      if (result.length === 1) {
        return { status: 'success', id: result[0].user_id, email: result[0].user_email, name: result[0].user_name, picture: result[0].user_picture };
      } else {
        return { status: 'fail' };
      }
    } catch (e) {
      console.log(e)
      return { status: 'error', error: e };
    }
  };

/**
* checkUserId(userId) -
* Checks if a user id exists by querying the 'userDetails' table.
* @param {string} userId The users id
* @return {JSON} A status code
*/
module.exports.checkUserId = async (userId) => {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT EXISTS(SELECT 1 FROM userDetails WHERE user_id = ?) AS sysCheck', [userId]));
    if (result[0].sysCheck === 1) {
      return { status: 'exists' }
    } else {
      return { status: 'empty' }
    }
  };