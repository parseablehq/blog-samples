CREATE DATABASE cdcdemo;
USE cdcdemo;
CREATE TABLE customers ( id SERIAL PRIMARY KEY, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, status VARCHAR(10)  );

CREATE TABLE orders ( id SERIAL PRIMARY KEY, order_date DATE NOT NULL, purchaser_id BIGINT UNSIGNED, product_id VARCHAR(10) NOT NULL, 
quantity INT NOT NULL,amount DECIMAL(10,2) NOT NULL, total_amount DECIMAL(10, 2) NOT NULL, status VARCHAR(10),  
FOREIGN KEY (purchaser_id) REFERENCES customers(id) ON DELETE CASCADE );

CREATE table customers_audit_log ( id SERIAL PRIMARY KEY, table_name VARCHAR(100) NOT NULL, operation_type VARCHAR(10) NOT NULL, primary_key_value BIGINT NOT NULL, old_values JSON, new_values JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

CREATE table orders_audit_log ( id SERIAL PRIMARY KEY, table_name VARCHAR(100) NOT NULL, operation_type VARCHAR(10) NOT NULL, primary_key_value BIGINT NOT NULL, old_values JSON, new_values JSON, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );

DELIMITER //

CREATE TRIGGER after_customers_update 
AFTER UPDATE ON customers 
FOR EACH ROW 
BEGIN
  INSERT INTO customers_audit_log 
  (table_name, operation_type, primary_key_value, old_values, new_values) 
  VALUES 
  (
    'customers',  
    'UPDATE',   
    OLD.id,    
    JSON_OBJECT('first_name', OLD.first_name, 'last_name', OLD.last_name, 'email', OLD.email),  
    JSON_OBJECT('first_name', NEW.first_name, 'last_name', NEW.last_name, 'email', NEW.email)
  );
END //
DELIMITER;

DELIMITER //

CREATE TRIGGER after_orders_update 
AFTER UPDATE ON orders 
FOR EACH ROW 
BEGIN
  INSERT INTO orders_audit_log 
  (table_name, operation_type, primary_key_value, old_values, new_values)  
  VALUES 
(    'orders',     
    'UPDATE',     
    OLD.id,     
    JSON_OBJECT('order_date', OLD.order_date, 'purchaser_id', OLD.purchaser_id, 'product_id', OLD.product_id,'quantity', OLD.quantity, 'amount', OLD.amount, 'total_amount', OLD.total_amount),    
    JSON_OBJECT('order_date', NEW.order_date, 'purchaser_id', NEW.purchaser_id, 'product_id', NEW.product_id,'quantity', NEW.quantity, 'amount', NEW.amount, 'total_amount', NEW.total_amount)  
  );
END //
DELIMITER;

DELIMITER //

CREATE TRIGGER after_customers_delete
AFTER DELETE ON customers
FOR EACH ROW
BEGIN
    INSERT INTO customers_audit_log 
    (table_name, operation_type, primary_key_value, old_values)  
    VALUES 
    (    
        'customers',     
        'DELETE',     
        OLD.id,     
        JSON_OBJECT('first_name', OLD.first_name, 'last_name', OLD.last_name, 'email', OLD.email)  
    );

END //
DELIMITER;

DELIMITER //

CREATE TRIGGER after_orders_delete
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    INSERT INTO orders_audit_log 
    (table_name, operation_type, primary_key_value, old_values)  
    VALUES 
    (    
        'orders',     
        'DELETE',     
        OLD.id,     
        JSON_OBJECT('order_date', OLD.order_date, 'purchaser_id', OLD.purchaser_id, 'product_id', OLD.product_id,'quantity', OLD.quantity, 'amount', OLD.amount, 'total_amount', OLD.total_amount)  
    );

END //

DELIMITER ;

GRANT RELOAD, SUPER, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO `mysqluser`@`%` ;
GRANT FLUSH_TABLES ON *.* TO `mysqluser`@`%`;
GRANT ALL PRIVILEGES ON `cdcdemo`.* TO `mysqluser`@`%`;

FLUSH PRIVILEGES;
