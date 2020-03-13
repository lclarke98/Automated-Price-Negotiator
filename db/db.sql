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
  negotiation_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  product_id int NOT NULL,
  user_id VARCHAR(25) NOT NULL,
  message VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES userDetails(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES productDetails(product_id) ON DELETE CASCADE
) ENGINE=INNODB;

use pn_DB

insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("SAMSUNG UE43RU7470UXXU 43 Smart 4K Ultra HD HDR LED TV with Bixby", 379.99, 329.99, 10);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("LENOVO IdeaPad S340 14 Laptop - Intel® Core™ i3, 128 GB SSD, Blue", 399.99, 359.99, 13);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("ASUS C223NA 11.6 Chromebook - Intel® Core™ Celeron, 32 GB eMMC, Grey", 199.00, 149.99, 8);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("LENOVO Tab E10 Tablet - 16 GB, Black", 99.00, 49.99, 18);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("NINTENDO Switch Lite - Turquoise", 199.00, 139.99, 17);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("LG LHB645N 5.1 3D Blu-ray & DVD Home Cinema System", 329.00, 289.99, 6);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("OCULUS Rift S VR Gaming Headset", 394.00, 324.99, 15);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("SAMSUNG LS34J550 Quad HD 34 LED Monitor - Dark Grey", 379.00, 319.99, 20);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("CANON EOS 4000D DSLR Camera - Body Only", 259.00, 200.99, 7);
insert into productDetails (product_name, product_rrp, product_lowestPrice, product_qty) values ("PHILIPS Hue White and Colour Ambience Mini Smart Bulb Starter Kit - E27", 119.99, 79.99, 21);
