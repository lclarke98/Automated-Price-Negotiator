CREATE DATABASE if not exists pn_DB;


CREATE TABLE if not exists pn_DB.userDetails(
  user_id VARCHAR(25) NOT NULL PRIMARY KEY,
  user_name VARCHAR(64) NOT NULL,
  user_email VARCHAR(64) NOT NULL,
  user_picture VARCHAR(1000) NOT NULL
) ENGINE=INNODB;

CREATE TABLE if not exists pn_DB.userCookies(
  user_id VARCHAR(25) NOT NULL,
  cookie_data VARCHAR(1000) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES userDetails(user_id) ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE if not exists pn_DB.productDetails(
  product_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(64) NOT NULL,
  product_rrp VARCHAR(64) NOT NULL,
  product_lowestPrice VARCHAR(64) NOT NULL,
  product_qty INT NOT NULL
) ENGINE=INNODB;


CREATE TABLE if not exists pn_DB.negotiation(
  negotiation_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id int NOT NULL,
  user_id VARCHAR(25) NOT NULL,
  message VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES userDetails(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES productDetails(product_id) ON DELETE CASCADE
) ENGINE=INNODB;
