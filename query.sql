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

--Menu table
CREATE TABLE Menu (
    menu_id INT PRIMARY KEY AUTO_INCREMENT,
    menu_name VARCHAR(255) NOT NULL,
    eventType_id INT NOT NULL,
    menuType_id INT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (eventType_id) REFERENCES EventType(eventType_id) ON DELETE CASCADE, 
    FOREIGN KEY (menuType_id) REFERENCES MenuType(menuType_id) ON DELETE CASCADE --If an eventType_id from EventType is deleted, all menus linked to that eventType_id in the Menu table will be automatically deleted.
);


--MenuType Table
CREATE TABLE MenuType (
    menuType_id INT PRIMARY KEY AUTO_INCREMENT,
    menu_id INT,
    menuType_name VARCHAR(100) UNIQUE NOT NULL
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE CASCADE
);


--Category Table
CREATE TABLE Category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    menuType_id INT,
    FOREIGN KEY (menuType_id) REFERENCES MenuType(menuType_id) ON DELETE CASCADE
    FOREIGN KEY (menu_id) REFERENCES Menu(menu_id) ON DELETE CASCADE
);

--Item Table
CREATE TABLE Item (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    item_name VARCHAR(255) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE
);

--CustomerSelection Table
CREATE TABLE CustomerSelection (
    selection_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    menuType_id INT,
    category_id INT,
    item_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (menuType_id) REFERENCES MenuType(menuType_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES Category(category_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES MenuItem(item_id) ON DELETE CASCADE
);

--Bites Table
CREATE TABLE Bites (
    bite_id INT PRIMARY KEY AUTO_INCREMENT,
    bite_name VARCHAR(100) NOT NULL,
    selection_id  INT,
    weight DECIMAL(5,2) NOT NULL, -- Weight in grams or kg
    price DECIMAL(10,2) NOT NULL
    FOREIGN KEY (selection_id) REFERENCES CustomerSelection(selection_id) ON DELETE CASCADE
);


--Beverages Table
CREATE TABLE Beverages (
    beverage_id INT PRIMARY KEY AUTO_INCREMENT,
    beverage_name VARCHAR(100) NOT NULL,
    selection_id  INT,
    price DECIMAL(10,2) NOT NULL
    FOREIGN KEY (selection_id) REFERENCES CustomerSelection(selection_id) ON DELETE CASCADE
);

--order table
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_price DECIMAL(10,2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bite_id INT,                -- Foreign key to Bites table (if the order contains a bite)
    beverage_id INT,            -- Foreign key to Beverages table 
    menu_item_id INT,           -- Foreign key to MenuItem table 
    quantity INT DEFAULT 1,     -- Quantity of the selected items
    price DECIMAL(10,2),        -- Price for the selected items
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (bite_id) REFERENCES Bites(bite_id) ON DELETE CASCADE,
    FOREIGN KEY (beverage_id) REFERENCES Beverages(beverage_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES Item(item_id) ON DELETE CASCADE
);


--OrderSummary Table
CREATE TABLE OrderSummary (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    total_price DECIMAL(10,2),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);





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




