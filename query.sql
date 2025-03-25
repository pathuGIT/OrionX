-- Create database
CREATE DATABASE orionX;

USE orionX;

-- Create Employee table
CREATE TABLE Employee (
    employee_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(12) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    bod DATE,
    salary DECIMAL(10,2),
    hire_date DATE,
    active_token VARCHAR(15)
);

CREATE TABLE Customer(
    customer_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(250),
    email VARCHAR(50) UNIQUE,
    role ENUM('customer'),
    address VARCHAR(255),
    phone VARCHAR(12) UNIQUE NOT NULL,
    staus ENUM('active','inactive'),
    create_date DATE,
    pasword VARCHAR(255),
    refresh_token VARCHAR(255)
);

-- Create SystemUser table
CREATE TABLE SystemUser (
    user_id VARCHAR(10) PRIMARY KEY,
    password VARCHAR(100),
    role ENUM('super_admin','sub_admin','employee'),
    status ENUM('active','inactive'),
    employee_id VARCHAR(10),
    refresh_token VARCHAR(250),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id) ON DELETE CASCADE
);

---catering system tables---

CREATE TABLE Menu_List_Type (
    menu_list_type_id VARCHAR(10) PRIMARY KEY,
    menu_list_name VARCHAR(255) NOT NULL
);

CREATE TABLE Menu_Type (
    menu_type_id VARCHAR(10) PRIMARY KEY,
    menu_type_name VARCHAR(255) NOT NULL,
    menu_list_type_id VARCHAR(10),
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (menu_list_type_id) REFERENCES Menu_List_Type(menu_list_type_id) ON DELETE CASCADE
);

CREATE TABLE Category (
    category_id VARCHAR(10) PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE Category_Menu_Type (
    category_menu_type_Id VARCHAR(10) PRIMARY KEY,
    menu_type_id VARCHAR(10),
    category_id VARCHAR(10),
    item_limit  INT DEFAULT NULL, 
    FOREIGN KEY (menu_type_id) REFERENCES Menu_Type(menu_type_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
);

CREATE TABLE Item (
    item_id VARCHAR(10) PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL
);

CREATE TABLE Item_Category_Menu_Type (
    ICMT_Id VARCHAR(10) PRIMARY KEY,
    category_menu_type_id VARCHAR(10),
    item_id VARCHAR(10),
    FOREIGN KEY (category_menu_type_id) REFERENCES Category_Menu_Type(category_menu_type_Id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES Item(item_id) ON DELETE CASCADE
);

CREATE TABLE Customer_Menu_Item_Selection (
    customer_id VARCHAR(10) NOT NULL,
    ICMT_Id VARCHAR(10),
    PRIMARY KEY (customer_id, ICMT_Id),
    FOREIGN KEY (ICMT_Id) REFERENCES Item_Category_Menu_Type(ICMT_Id) ON DELETE CASCADE
);


--trigger to format menu_list_type
DELIMITER //

CREATE TRIGGER before_menu_list_type_insert
BEFORE INSERT ON Menu_List_Type
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(menu_list_type_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Menu_List_Type;
    SET new_id = CONCAT('MLT', LPAD(max_id, 3, '0'));
    SET NEW.menu_list_type_id = new_id;
END //

DELIMITER ;

--trigger to format menu_type
DELIMITER //

CREATE TRIGGER before_menu_type_insert
BEFORE INSERT ON Menu_Type
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(menu_type_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Menu_Type;
    SET new_id = CONCAT('MT', LPAD(max_id, 3, '0'));
    SET NEW.menu_type_id = new_id;
END //

DELIMITER ;

--trigger to format category
DELIMITER //

CREATE TRIGGER before_category_insert
BEFORE INSERT ON Category
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the maximum numerical value of category_id (excluding the 'CAT' prefix)
    SELECT COALESCE(MAX(CAST(SUBSTRING(category_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Category;

    -- Generate new category_id with the 'C' prefix
    SET new_id = CONCAT('C', LPAD(max_id, 3, '0'));

    -- Set the new category_id
    SET NEW.category_id = new_id;
END //

DELIMITER ;


--trigger to format category_menu_type
DELIMITER //

CREATE TRIGGER before_category_menu_type_insert
BEFORE INSERT ON Category_Menu_Type
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(category_menu_type_Id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Category_Menu_Type;
    SET new_id = CONCAT('CMT', LPAD(max_id, 3, '0'));
    SET NEW.category_menu_type_Id = new_id;
END //

DELIMITER ;

--trigger to format item
DELIMITER //

CREATE TRIGGER before_item_insert
BEFORE INSERT ON Item
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(item_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Item;
    SET new_id = CONCAT('I', LPAD(max_id, 3, '0'));
    SET NEW.item_id = new_id;
END //

DELIMITER ;

--trigger to format item_category_menu_type
DELIMITER //

CREATE TRIGGER before_item_category_menu_type_insert
BEFORE INSERT ON Item_Category_Menu_Type
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(ICMT_Id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Item_Category_Menu_Type;
    SET new_id = CONCAT('ICMT', LPAD(max_id, 3, '0'));
    SET NEW.ICMT_Id = new_id;
END //

DELIMITER ;




-- Trigger to format employee_id
DELIMITER //

CREATE TRIGGER before_employee_insert
BEFORE INSERT ON Employee
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Employee;
    SET new_id = CONCAT('EMP', LPAD(max_id, 3, '0'));
    SET NEW.employee_id = new_id;
END //

-- Trigger to format customer_id
DELIMITER //

CREATE TRIGGER before_customer_insert
BEFORE INSERT ON Customer
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(customer_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Customer;
    SET new_id = CONCAT('CUS', LPAD(max_id, 3, '0'));
    SET NEW.customer_id = new_id;
END //

-- Trigger to format user_id
CREATE TRIGGER before_user_insert
BEFORE INSERT ON SystemUser
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(user_id, 3) AS UNSIGNED)), 0) + 1 INTO max_id FROM SystemUser;
    SET new_id = CONCAT('SU', LPAD(max_id, 3, '0'));
    SET NEW.user_id = new_id;
END //

DELIMITER ;




-- Insert sample data
INSERT INTO Employee (name, phone, email, bod, salary, hire_date, active_token) VALUES ('saman', '07712345678', 'ksl@gmail.com', '2001-02-09', 5000, CURDATE(), 'OPT123');
INSERT INTO SystemUser (password, role, status, employee_id, refresh_token) VALUES ('password123', 'super_admin', 'active', 'emp001', 'refresh_token_example');
INSERT INTO Customer (name, email, address, phone, staus, create_date) VALUES ("Gamini", 'gamini@gmail.com','Galle SA Road','0778564596', 'active', CURDATE());




