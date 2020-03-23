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

module.exports.getProducts = async () => {
  try {
    const sql = await config.sqlPromise;
    const [result] = await sql.query(sql.format('SELECT * FROM productDetails'));
    return result;
  } catch (e) {
    console.log(e)
    return { status: 'error', error: e };
  }
};

module.exports.createProduct = async (productDetails) => {
  try {
    const sql = await config.sqlPromise;
    const newProduct = {
      product_name: productDetails.productName,
      product_rrp: productDetails.productRRP,
      product_lowestPrice: productDetails.productLowestPrice,
      product_qty: productDetails.productQty
    };
    await sql.query(sql.format('INSERT INTO productDetails SET ?', newProduct));
    return { status: 'success' };
  } catch (e) {
    console.log(e);
    return { status: 'error', error: e };
  }
};
