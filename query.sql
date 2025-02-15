-- // Create database
CREATE database orionX;

CREATE TABLE user (
    userid INT PRIMARY KEY,
    name VARCHAR(100),
    role VARCHAR(50),
    password VARCHAR(100),
    email VARCHAR(100),
    bod DATE,
    contact VARCHAR(15)
);