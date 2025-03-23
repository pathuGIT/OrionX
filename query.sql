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
    service_charge_precentage DECIMAL(3.2),
    hire_date DATE
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

CREATE TABLE Booking (
    booking_id VARCHAR(10) PRIMARY KEY,
    time_slot ENUM('day','night'),
    status ENUM('pending','confirmed','cancelled'),
    booking_date DATE,
    total_price DECIMAL(10,2),
    created_at DATE,
    updated_at DATE,
    venue_id VARCHAR(10),
    FOREIGN KEY (venue_id) REFERENCES venue(venue_id) ON DELETE CASCADE
);

CREATE TABLE venue (
    venue_id VARCHAR(10) PRIMARY KEY,
    venue_name VARCHAR(200),
    time_slot ENUM('day','night'),
    Location ENUM('indoor','outdoor','both'),
    capacity INT,
    price DECIMAL(10,2),
    created_at DATE,
    updated_at DATE
);

CREATE TABLE bookig_history (
    history_id VARCHAR(10),
    action_date DATE,
    employee_id VARCHAR(10),
    booking_id VARCHAR(10),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE
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

DELIMITER //
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

DELIMITER //
-- Trigger to format venue_id
CREATE TRIGGER before_venue_insert
BEFORE INSERT ON venue
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(venue_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM venue;
    SET new_id = CONCAT('VNU', LPAD(max_id, 3, '0'));
    SET NEW.venue_id = new_id;
END //

DELIMITER //
-- Trigger to format booking_id
CREATE TRIGGER before_booking_insert
BEFORE INSERT ON booking
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM booking;
    SET new_id = CONCAT('BID', LPAD(max_id, 3, '0'));
    SET NEW.booking_id = new_id;
END //

DELIMITER //
CREATE TRIGGER before_bookig_history_insert
BEFORE INSERT ON bookig_history
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    SELECT COALESCE(MAX(CAST(SUBSTRING(history_id, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM bookig_history;
    SET new_id = CONCAT('BHID', LPAD(max_id, 3, '0'));
    SET NEW.history_id = new_id;
END //

DELIMITER ;



-- hard code super admin data
INSERT INTO Employee (name, phone, email, bod, salary, service_charge_precentage, hire_date) VALUES ('shan', '0771988848 ', 'shan@gmail.com', '0000-00-00', 0, 0,  CURDATE());
