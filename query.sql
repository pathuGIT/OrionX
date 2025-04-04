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
CREATE TABLE Booking (
    booking_id VARCHAR(10) PRIMARY KEY,
    time_slot ENUM('day','night'),
    status ENUM('pending','confirmed','cancelled'),
    booking_date DATE,
    event_type ENUM('custome','wedding'), -- New column added after booking_date
    event_name VARCHAR(200), -- New column added after event_type
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

CREATE TABLE otp_store (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    created_at TIME,
    source_table VARCHAR(50) NOT NULL
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
    Event_ID VARCHAR(10) PRIMARY KEY,
    Buffet_TimeFrom TIME,
    Buffet_TimeTo TIME,
    Additional_Time TIME,
    Function_durationFrom TIME,
    Function_durationTo TIME,
    Tea_table_Time TIME,
    Dress_Time TIME,
    booking_id VARCHAR(10),
    BarRequirementID VARCHAR(10),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (BarRequirementID) REFERENCES Bar(BarRequirementID) ON DELETE CASCADE
);

-- Create Bar table
CREATE TABLE Bar (
    BarRequirementID VARCHAR(10) PRIMARY KEY,
    LiquorTimeFrom TIME,
    LiquorTimeTo TIME,
    BarPax INT
);

-- Create Bite table

CREATE TABLE Bite (
    Bite_ID VARCHAR(10) PRIMARY KEY,
    Quantity INT,
    Type VARCHAR(50),
    BarRequirementID VARCHAR(10),
    FOREIGN KEY (BarRequirementID) REFERENCES Bar(BarRequirementID)
);

-- Create BiteByGuest table

CREATE TABLE BiteByGuest (
    Bite_Name VARCHAR(100),
    Quantity INT,
    BarRequirementID VARCHAR(10),
    FOREIGN KEY (BarRequirementID) REFERENCES Bar(BarRequirementID)
);

-- Create Cordinator table

CREATE TABLE Cordinator (
    Cordinator_Name VARCHAR(100) PRIMARY KEY,
    Contact_no VARCHAR(15)
);

-- Create Event_Service table

CREATE TABLE Event_Service (
    Event_Service_ID VARCHAR(10) PRIMARY KEY,
    Event_Service_Name VARCHAR(100)
);

-- Create Vendor table

CREATE TABLE Vendor (
    Vendor_ID VARCHAR(10) PRIMARY KEY,
    Contact_no VARCHAR(15),
    Email VARCHAR(100),
    Address VARCHAR(255)
);

-- Create Assigned_Employee table

CREATE TABLE Assigned_Employee (
    Employee_Assign_ID VARCHAR(10) PRIMARY KEY,
    Employee_ID VARCHAR(10),
    User_Role VARCHAR(50),
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID)
);

-- Create Soft_Drink table

CREATE TABLE Soft_Drink (
    Beverage_Name VARCHAR(100),
    ForBar INT,
    ForTable INT,
    Event_ID VARCHAR(10),
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID)
);

-- Create Wedding table

CREATE TABLE Wedding (
    Event_ID VARCHAR(10),
    Groom_Name VARCHAR(100),
    Bride_Name VARCHAR(100),
    Groom_Contact_no VARCHAR(15),
    Bride_Contact_no VARCHAR(15),
    Fountain VARCHAR(10),
    ProsperityTable VARCHAR(10),
    Groom_Address VARCHAR(255),
    Bride_Address VARCHAR(255),
    Poruwa_CeremonyFrom TIME,
    Poruwa_CeremonyTo TIME,
    Registration_Time TIME,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID)
);

-- Create CustomEvent table
CREATE TABLE CustomEvent (
    Event_ID VARCHAR(10),
    Event_Name VARCHAR(100),
    ContactPersonName VARCHAR(100),
    ContactPersonNumber VARCHAR(15),
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID)
);


-- Create Table_Reserve table

CREATE TABLE Table_Reserve (
    Table_Reserve_ID VARCHAR(10) PRIMARY KEY,
    Table_Number INT,
    Reserve_Name VARCHAR(100)
);

-- Create Table_Chair table

CREATE TABLE Table_Chair_Arrangement (
    Arrangement_ID VARCHAR(10)  PRIMARY KEY,
    Head_Table_Pax INT,
    Top_Cloth_Color VARCHAR(50),
    Table_Cloth_Color VARCHAR(50),
    Bow_Color VARCHAR(50),
    Chair_Cover_Color VARCHAR(50),
    Table_Reserve_ID VARCHAR(10),
    FOREIGN KEY (Table_Reserve_ID) REFERENCES Table_Reserve(Table_Reserve_ID)
);


--many to many tables 

CREATE TABLE Event_Event_Service (
    Event_ID VARCHAR(10) NOT NULL,
    event_service_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (event_service_id) REFERENCES Event_Service(event_service_id) ON DELETE CASCADE
);

CREATE TABLE Event_Service_Vendor (
    event_service_id VARCHAR(10) NOT NULL,
    vendor_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (event_service_id) REFERENCES Event_Service(event_service_id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES Vendor(vendor_id) ON DELETE CASCADE
);

CREATE TABLE Event_Assigned_Employee (
    Event_ID VARCHAR(10) NOT NULL,
    Employee_Assign_ID VARCHAR(10) NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (Employee_Assign_ID) REFERENCES Assigned_Employee(Employee_Assign_ID) ON DELETE CASCADE
);

CREATE TABLE Event_Table_Chair (
    Event_ID VARCHAR(10) NOT NULL,
    Arrangement_Id VARCHAR(10) NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (Arrangement_Id) REFERENCES Table_Chair_Arrangement(Arrangement_Id) ON DELETE CASCADE
);

CREATE TABLE Event_Cordinator (
    Event_ID VARCHAR(10) NOT NULL,
    Cordinator_Name VARCHAR(100) NOT NULL,
    FOREIGN KEY (Event_ID) REFERENCES Event(Event_ID) ON DELETE CASCADE,
    FOREIGN KEY (Cordinator_Name) REFERENCES Cordinator(Cordinator_Name) ON DELETE CASCADE
);




-- Trigger to format Table_Reserve_ID
DELIMITER //
CREATE TRIGGER before_Table_Reserve
BEFORE INSERT ON Table_Reserve
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the max Table_Reserve_ID by extracting numeric part
    SELECT COALESCE(MAX(CAST(SUBSTRING(Table_Reserve_ID, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Table_Reserve;
    
    -- Format the new ID as 'TAB' followed by a zero-padded number (3 digits)
    SET new_id = CONCAT('TAB', LPAD(max_id, 6, '0'));
    SET NEW.Table_Reserve_ID = new_id;
END //
DELIMITER ;


-- Trigger to format Arrangement_ID
DELIMITER //
CREATE TRIGGER before_Table_Chair_Arrangement
BEFORE INSERT ON Table_Chair_Arrangement
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the max Arrangement_ID by extracting numeric part
    SELECT COALESCE(MAX(CAST(SUBSTRING(Arrangement_ID, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Table_Chair_Arrangement;
    
    -- Format the new ID as 'TCA' followed by a zero-padded number (3 digits)
    SET new_id = CONCAT('TCA', LPAD(max_id, 6, '0'));
    SET NEW.Arrangement_ID = new_id;
END //
DELIMITER ;


-- Trigger to format Employee_Assign_ID
DELIMITER //
CREATE TRIGGER before_Assigned_Employee
BEFORE INSERT ON Assigned_Employee
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the max Employee_Assign_ID by extracting numeric part
    SELECT COALESCE(MAX(CAST(SUBSTRING(Employee_Assign_ID, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Assigned_Employee;
    
    -- Format the new ID as 'EMP' followed by a zero-padded number (3 digits)
    SET new_id = CONCAT('EMP', LPAD(max_id, 6, '0'));
    SET NEW.Employee_Assign_ID = new_id;
END //
DELIMITER ;


-- Trigger to format Vendor_ID
DELIMITER //
CREATE TRIGGER before_Vendor
BEFORE INSERT ON Vendor
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the max Vendor_ID by extracting numeric part
    SELECT COALESCE(MAX(CAST(SUBSTRING(Vendor_ID, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Vendor;
    
    -- Format the new ID as 'VEN' followed by a zero-padded number (3 digits)
    SET new_id = CONCAT('VEN', LPAD(max_id, 6, '0'));
    SET NEW.Vendor_ID = new_id;
END //
DELIMITER ;


-- Trigger to format Event_Service_ID
DELIMITER //
CREATE TRIGGER before_Event_Service
BEFORE INSERT ON Event_Service
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the max Event_Service_ID by extracting numeric part
    SELECT COALESCE(MAX(CAST(SUBSTRING(Event_Service_ID, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Event_Service;
    
    -- Format the new ID as 'ES' followed by a zero-padded number (2 digits)
    SET new_id = CONCAT('ES', LPAD(max_id, 6, '0'));
    SET NEW.Event_Service_ID = new_id;
END //
DELIMITER ;


-- Trigger to format Bite_ID
DELIMITER //
CREATE TRIGGER before_Bite
BEFORE INSERT ON Bite
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the max Bite_ID by extracting numeric part
    SELECT COALESCE(MAX(CAST(SUBSTRING(Bite_ID, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Bite;
    
    -- Format the new ID as 'BITE' followed by a zero-padded number (4 digits)
    SET new_id = CONCAT('BITE', LPAD(max_id, 6, '0'));
    SET NEW.Bite_ID = new_id;
END //
DELIMITER ;


-- Trigger to format BarRequirementID
DELIMITER //
CREATE TRIGGER before_Bar
BEFORE INSERT ON Bar
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the max BarRequirementID by extracting numeric part
    SELECT COALESCE(MAX(CAST(SUBSTRING(BarRequirementID, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Bar;
    
    -- Format the new ID as 'BAR' followed by a zero-padded number (3 digits)
    SET new_id = CONCAT('BAR', LPAD(max_id, 6, '0'));
    SET NEW.BarRequirementID = new_id;
END //
DELIMITER ;


-- Trigger to format Event_ID
DELIMITER //
CREATE TRIGGER before_Event_ID
BEFORE INSERT ON Event
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Find the max Event_ID by extracting numeric part
    SELECT COALESCE(MAX(CAST(SUBSTRING(Event_ID, 4) AS UNSIGNED)), 0) + 1 INTO max_id FROM Event;
    
    -- Format the new ID as 'EVN' followed by a zero-padded number (3 digits)
    SET new_id = CONCAT('EVN', LPAD(max_id, 6, '0'));
    SET NEW.Event_ID = new_id;
END //
DELIMITER ;





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




-- Insert sample data
INSERT INTO Employee (name, phone, email, bod, salary, service_charge_precentage, hire_date) VALUES ('shan', '07712345678', 'shan@gmail.com', '1970-02-09', 0, 0, CURDATE());
INSERT INTO SystemUser (password, role, status, employee_id, refresh_token) VALUES ('password123', 'super_admin', 'active', 'emp001', 'refresh_token_example');
INSERT INTO Customer (name, email, address, phone, staus, create_date) VALUES ("Gamini", 'gamini@gmail.com','Galle SA Road','0778564596', 'active', CURDATE());

DELIMITER //

CREATE TRIGGER Before_Insert_Menu_Type 
BEFORE INSERT ON Menu_Type 
FOR EACH ROW
BEGIN
    DECLARE max_id INT;
    DECLARE new_id VARCHAR(10);

    -- Extract the numeric part from menu_type_id and find the max value
    SELECT COALESCE(MAX(CAST(SUBSTRING(menu_type_id, 3) AS UNSIGNED)), 0) + 1 INTO max_id FROM Menu_Type;
    
    -- Format the new ID as 'MT' followed by a zero-padded number
    SET new_id = CONCAT('MT', LPAD(max_id, 3, '0'));
    
    -- Assign the new ID to the inserted row
    SET NEW.menu_type_id = new_id;
END //

DELIMITER //

CREATE EVENT auto_delete_otp
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    DELETE FROM otp_store WHERE created_at < NOW() - INTERVAL 3 MINUTE;
END //
DELIMITER ;
