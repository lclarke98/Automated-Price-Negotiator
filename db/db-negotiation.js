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

module.exports.check = async (userId, productId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT * FROM negotiation WHERE user_id = ? AND product_id = ?', [userId, productId]));
    if (result.length > 0) {
        return ({ status: 'exists', negotiationId: result[0].negotiation_id })
    } else {
        return ({ status: 'empty' })
    }
    return result;
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

module.exports.checkNegotiationId = async (negotiationId) => {
    try {
        const sql = await config.sqlPromise;
        const [result] = await sql.query(sql.format('SELECT * FROM negotiation WHERE negotiation_id = ?', [negotiationId]));
    if (result.length > 0) {
        return ({ status: 'exists' })
    } else {
        return ({ status: 'empty' })
    }
    } catch(e) {
        console.log(e);
        return { status: 'error', error: e }; 
    }
}

module.exports.getNegotiation = async (negotiationId) => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT * FROM negotiation WHERE negotiation_id = ?', [negotiationId]));
    return result;
  } catch (e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};

module.exports.createNegotiation = async (negotiationId, userId, productId) => {
    try {
        const sql = await config.sqlPromise;
        
        const newNegotiation = {
            negotiation_id: negotiationId,
            product_id: productId,
            user_id: userId,
            message: "Hello, I would like to negotiate."
          };
          await sql.query(sql.format('INSERT INTO negotiation SET ?', newNegotiation));
    } catch(e) {
        console.log(e);
        return { status: 'error', error: e };
    }
}