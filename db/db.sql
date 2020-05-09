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
  product_name VARCHAR(128) NOT NULL,
  product_rrp INT NOT NULL,
  product_lowestPrice INT NOT NULL,
  product_qty INT NOT NULL
) ENGINE=INNODB;

CREATE TABLE if not exists pn_DB.negotiation(
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  negotiation_id VARCHAR(8) NOT NULL,
  product_id INT NOT NULL,
  user_id VARCHAR(25) NOT NULL,
  message VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES userDetails(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES productDetails(product_id) ON DELETE CASCADE
) ENGINE=INNODB;

use pn_DB;

insert into userDetails (user_id, user_name, user_email, user_picture) values ("BOT", "BOT", "bot@APNSA.com", "Void");

insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("LENOVO IdeaPad S340 14 Laptop - Intel Core i3, 128 GB SSD, Blue", 399.99, 359.99, 13);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("NINTENDO Switch Lite - Turquoise", 199.00, 139.99, 17);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("SAMSUNG LS34J550 Quad HD 34 LED Monitor - Dark Grey", 379.00, 319.99, 20);

insert into negotiation (negotiation_id, product_id, user_id, message) values ("8chrg221", 1, "BOT", "Hello");
insert into negotiation (negotiation_id, product_id, user_id, message) values ("7chrg221", 2, "BOT", "Hello");
insert into negotiation (negotiation_id, product_id, user_id, message) values ("8chrg221", 1, "BOT", "How are you doing?");
insert into negotiation (negotiation_id, product_id, user_id, message) values ("8chrg221", 1, "BOT", "That is good.");
insert into negotiation (negotiation_id, product_id, user_id, message) values ("66hrg221", 1, "BOT", "Hello");
