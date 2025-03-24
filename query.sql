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

-- Create Event table
CREATE TABLE Event (
    Event_ID VARCHAR AUTO_INCREMENT PRIMARY KEY,
    Buffet_TimeFrom TIME,
    Buffet_TimeTo TIME,
    Additional_Time TIME,
    Function_durationFrom TIME,
    Function_durationTo TIME,
    Tea_table_Time TIME,
    Dress_Time TIME,
    Menu_ID INT,
    Booking_ID INT,
    BarRequirementID VARCHAR,
    FOREIGN KEY (Booking_ID) REFERENCES Booking(BookingID),
    FOREIGN KEY (BarRequirementID) REFERENCES Bar(BarRequirementID)
);

-- Create Bar table
CREATE TABLE Bar (
    BarRequirementID VARCHAR AUTO_INCREMENT PRIMARY KEY,
    LiquorTimeFrom TIME,
    LiquorTimeTo TIME,
    BarPax INT,
);

-- Create Bite table

CREATE TABLE Bite (
    Bite_ID VARCHAR AUTO_INCREMENT PRIMARY KEY,
    Event_ID INT,
    Quantity INT,
    Type VARCHAR(50),
    BarRequirementID VARCHAR,
    FOREIGN KEY (BarRequirementID) REFERENCES Bar(BarRequirementID)
);

-- Create BiteByGuest table

CREATE TABLE BiteByGuest (
    Bite_Name VARCHAR(100),
    Quantity INT,
    BarRequirementID VARCHAR,
    FOREIGN KEY (BarRequirementID) REFERENCES Bar(BarRequirementID)
);

-- Create Coordinator table

CREATE TABLE Coordinator (
    Cordinator_Name VARCHAR(100) PRIMARY KEY,
    Contact_no VARCHAR(15),
);

-- Create Event_Service table

CREATE TABLE Event_Service (
    Event_Service_ID VARCHAR AUTO_INCREMENT PRIMARY KEY,
    Event_Service_Name VARCHAR(100),
);

-- Create Vendor table

CREATE TABLE Vendor (
    Vendor_ID VARCHAR AUTO_INCREMENT PRIMARY KEY,
    Contact_no VARCHAR(15),
    Email VARCHAR(100),
    Address VARCHAR(255)
);

-- Create Assigned_Employee table

CREATE TABLE Assigned_Employee (
    Employee_Assign_ID VARCHAR AUTO_INCREMENT PRIMARY KEY,
    Employee_ID VARCHAR,
    User_Role VARCHAR(50),
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
);

-- Create Soft_Drink table

CREATE TABLE Soft_Drink (
    Beverage_Name VARCHAR(100),
    ForBar BOOLEAN,
    ForTable BOOLEAN,
    Event_ID VARCHAR,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID)
);

-- Create Wedding table

CREATE TABLE Wedding (
    Event_ID VARCHAR,
    Groom_Name VARCHAR(100),
    Bride_Name VARCHAR(100),
    Groom_Contact_no VARCHAR(15),
    Bride_Contact_no VARCHAR(15),
    Fountain BOOLEAN,
    ProsperityTable BOOLEAN,
    Groom_Address VARCHAR(255),
    Bride_Address VARCHAR(255),
    Poruwa_CeremonyFrom TIME,
    Poruwa_CeremonyTo TIME,
    Registration_Time DATETIME,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID)
);

-- Create CustomEvent table
CREATE TABLE CustomEvent (
    Event_ID INT,
    ContactPersonName VARCHAR(100),
    ContactPersonNumber VARCHAR(15),
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID)
);

-- Create Table_Chair table

CREATE TABLE Table_Chair (
    Arrangement_ID INT AUTO_INCREMENT PRIMARY KEY,
    Head_Table_Pax INT,
    Top_Cloth_Color VARCHAR(50),
    Table_Cloth_Color VARCHAR(50),
    Bow_Color VARCHAR(50),
    Chair_Cover_Color VARCHAR(50)
);

-- Create Table_Reserve table

CREATE TABLE Table_Reserve (
    Table_Reserve_ID INT AUTO_INCREMENT PRIMARY KEY,
    Table_Number INT,
    Reserve_Name VARCHAR(100),
    Arrangement_ID INT,
    FOREIGN KEY (Arrangement_ID) REFERENCES Table_Chair(Arrangement_ID)
);

--many to many tables 

CREATE TABLE Event_Event_Service (
    Event_ID INT NOT NULL,
    event_service_id INT NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (event_service_id) REFERENCES Event_Service(event_service_id) ON DELETE CASCADE
);

CREATE TABLE Event_Service_Vendor (
    event_service_id INT NOT NULL,
    vendor_id INT NOT NULL,
    FOREIGN KEY (event_service_id) REFERENCES Event_Service(event_service_id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES Vendors(vendor_id) ON DELETE CASCADE
);

CREATE TABLE Event_Assigned_Employee (
    Event_ID INT NOT NULL,
    employee_assign_id INT NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (employee_assign_id) REFERENCES Employees(employee_assign_id) ON DELETE CASCADE
);

CREATE TABLE Event_Table_Chair (
    Event_ID INT NOT NULL,
    Arrangement_Id INT NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (Arrangement_Id) REFERENCES Arrangements(Arrangement_Id) ON DELETE CASCADE
);

CREATE TABLE Event_Coordinator (
    Event_ID INT NOT NULL,
    Coordinator_Name VARCHAR(255) NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (Coordinator_Name) REFERENCES Coordinator(Coordinator_Name) ON DELETE CASCADE
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