CREATE DATABASE if not exists priceNegotiator;


CREATE TABLE if not exists priceNegotiator.userDetails(
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(64) NOT NULL,
  user_email VARCHAR(64) NOT NULL,
  user_picture VARCHAR(64) NOT NULL
);

CREATE TABLE if not exists priceNegotiator.userCookies(
  cookie_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  cookie_data VARCHAR(64) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES userDetails(user_id) ON DELETE CASCADE
);

CREATE TABLE if not exists priceNegotiator.negotiation(
  negotiation_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id int NOT NULL,
  user_id int NOT NULL,
  message VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES userDetails(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES productDetails(product_id) ON DELETE CASCADE
);

CREATE TABLE if not exists priceNegotiator.productDetails(
  product_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(64) NOT NULL,
  product_rrp VARCHAR(64) NOT NULL,
  product_lowestPrice VARCHAR(64) NOT NULL,
  product_qty INT NOT NULL
);
