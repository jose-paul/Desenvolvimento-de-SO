DROP  TABLE IF EXISTS  Credit_Card CASCADE;
DROP  TABLE IF EXISTS  User_Account CASCADE;
DROP  TABLE IF EXISTS  Vehicle CASCADE;
DROP  TABLE IF EXISTS  User_Vehicle CASCADE;
DROP  TABLE IF EXISTS  User_Deliver CASCADE;
DROP  TABLE IF EXISTS  Package CASCADE;
DROP  TABLE IF EXISTS  User_Package CASCADE;
DROP  TABLE IF EXISTS  Delivery CASCADE;

CREATE TABLE IF NOT EXISTS Credit_Card (
    Card_Number BIGINT NOT NULL,
    Card_CVV INT NOT NULL,
    Card_Owner VARCHAR(32) NOT NULL,
    Card_Expires INT NOT NULL,
    PRIMARY KEY (Card_Number)
);

CREATE TABLE IF NOT EXISTS User_Account (
    CPF BIGINT NOT NULL UNIQUE,
    Account_Name VARCHAR(32) NOT NULL,
    Account_Email VARCHAR(32) NOT NULL,
    Account_Pass VARCHAR(64) NOT NULL,
    Account_Phone VARCHAR(16) NOT NULL,
    Credit_Card_ID INT,
    PRIMARY KEY (CPF),
    FOREIGN KEY (Credit_Card_ID) REFERENCES Credit_Card (Card_Number)
);

CREATE TABLE IF NOT EXISTS Vehicle(
    Vehicle_ID INT GENERATED ALWAYS AS IDENTITY,
    Vehicle_Type VARCHAR(64),
    PRIMARY KEY (Vehicle_ID)
);

CREATE TABLE IF NOT EXISTS User_Deliver (
    Account_CPF BIGINT NOT NULL UNIQUE,
    Deliver_Pix VARCHAR(64) NOT NULL,
    PRIMARY KEY (Account_CPF),
    FOREIGN KEY (Account_CPF) REFERENCES User_Account (CPF)
);

CREATE TABLE IF NOT EXISTS Package(
    Package_ID INT GENERATED ALWAYS AS IDENTITY,
    Package_Origin VARCHAR(64) NOT NULL,
    Package_Destiny VARCHAR(64) NOT NULL,
    Package_Price DECIMAL(4, 2) NOT NULL,
    Package_Description VARCHAR(256),
    Package_Estimated_Time INT,
    Package_Size  DECIMAL(4, 2) NOT NULL,
    Package_Create_Date_Delivery timestamp NOT NULL,
    PRIMARY KEY (Package_ID)
);
