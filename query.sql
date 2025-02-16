-- Create database
CREATE DATABASE orionX;

USE orionX;

CREATE TABLE user (
    userid INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    role ENUM('super_admin', 'sub_admin', 'employees'),
    password VARCHAR(100),
    email VARCHAR(100),
    bod DATE,
    contact VARCHAR(15)
);

INSERT INTO user (name, role, password, email, bod, contact) VALUES
('Shan', 'super_admin', 'password123', 'Shan@gmail.com', '1980-01-01', '0774567890'),
('Lalitha', 'employees', 'password456', 'lalitha@gmail.com', '1985-02-02', '0717654321'),
('Akila', 'employees', 'password789', 'Akila@gmail.com', '1990-03-03', '0742334455'),
('Kamal', 'employees', 'password321', 'Kamal@gmail.com', '1995-04-04', '0776778899');