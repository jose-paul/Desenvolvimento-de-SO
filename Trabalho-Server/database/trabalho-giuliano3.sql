DROP  TABLE IF EXISTS  Credit_Card ;
DROP  TABLE IF EXISTS  User_Account ;
DROP  TABLE IF EXISTS  Vehicle ;
DROP  TABLE IF EXISTS  User_Deliver ;
DROP  TABLE IF EXISTS  Package ;
DROP  TABLE IF EXISTS  User_Package ;
DROP  TABLE IF EXISTS  Delivery ;

CREATE TABLE IF NOT EXISTS Credit_Card (
    Card_Number BIGINT NOT NULL,
    Card_CVV INT NOT NULL,
    Card_Owner VARCHAR(32) NOT NULL,
    Card_Expires INT NOT NULL,
    PRIMARY KEY (Card_Number)
);

CREATE TABLE IF NOT EXISTS User_Account (
    CPF BIGINT NOT NULL,
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
    Account_CPF BIGINT NOT NULL,
    Deliver_Pix VARCHAR(64) NOT NULL,
    PRIMARY KEY (Account_CPF),
    FOREIGN KEY (Account_CPF) REFERENCES User_Account (CPF)
);

CREATE TABLE IF NOT EXISTS User_Vehicle (
    Vehicle_ID BIGINT NOT NULL UNIQUE,
    Account_CPF BIGINT NOT NULL,
    PRIMARY KEY (Vehicle_ID, Account_CPF),
    FOREIGN KEY (Vehicle_ID) REFERENCES Vehicle (Vehicle_ID),
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

CREATE TABLE IF NOT EXISTS User_Package (
    Package_ID INT NOT NULL,
    Account_CPF BIGINT NOT NULL,
    Package_Main BOOLEAN NOT NULL,
    PRIMARY KEY (Package_ID, Account_CPF),
    FOREIGN KEY (Package_ID) REFERENCES Package (Package_ID),
    FOREIGN KEY (Account_CPF) REFERENCES User_Account (CPF)
);

CREATE TABLE IF NOT EXISTS Delivery (
    Vehicle_ID BIGINT NOT NULL,
    User_Destiny_CPF BIGINT NOT NULL,
    User_Delivery_CPF BIGINT NOT NULL,
    Package_ID INT NOT NULL,
    PRIMARY KEY (
        Vehicle_ID,
        User_Destiny_CPF,
        User_Delivery_CPF,
        Package_ID
    ),
    FOREIGN KEY (Vehicle_ID) REFERENCES Vehicle (Vehicle_ID),
    FOREIGN KEY (Package_ID) REFERENCES Package (Package_ID),
    FOREIGN KEY (User_Destiny_CPF) REFERENCES User_Account (CPF),
    FOREIGN KEY (User_Delivery_CPF) REFERENCES User_Account (CPF)
);

--/ Insert into credit_card for Giuliano 
INSERT INTO public.credit_card
(card_number, card_cvv, card_owner, card_expires)
VALUES(12345678, 123, 'Giuliano', 2025);

--/ Insert into credit_card for Gabriel 
INSERT INTO public.credit_card
(card_number, card_cvv, card_owner, card_expires)
VALUES(87654321, 321, 'Gabriel', 2027);

--/ insert Into user_account for Giuliano
INSERT INTO public.user_account
(cpf, account_name, account_email, account_pass, account_phone, credit_card_id)
VALUES(11111111111, 'Giuliano', 'giuliano@hotmail.com', '1234', '123456789', 12345678);


--/ insert Into user_account for Gabriel
INSERT INTO public.user_account
(cpf, account_name, account_email, account_pass, account_phone, credit_card_id)
VALUES(222222222222, 'Gabriel', 'gabriel@hotmail.com', '1234', '87654321', 87654321);


--/ insert into user_deliver for gabriel 
INSERT INTO public.user_deliver
(account_cpf, deliver_pix)
VALUES(222222222222, '654321');



--/ Insert into package 
INSERT INTO public.package
(package_origin, package_destiny, package_price, package_description, package_estimated_time, package_size, package_create_date_delivery)
VALUES('Casa Do Giuliano', 'Destino', 00.08, 'Pacote de Querys Sql', 10, 00.09, '2022-01-01 00:00:01');

--/ Insert into delivery 
INSERT INTO public.delivery
(vehicle_id, user_destiny_cpf, user_delivery_cpf, package_id)
VALUES(1, 11111111111, 222222222222, 1);

--/ insert into user_package 
INSERT INTO public.user_package
(package_id, account_cpf, package_main)
VALUES(1, 11111111111, false);





--/ insert  into user_vehicle 
INSERT INTO public.user_vehicle
(vehicle_id, account_cpf)
VALUES(1, 222222222222);

--/ insert into vehicle 
INSERT INTO public.vehicle
(vehicle_type)
VALUES('carro');




--//Filtrar pedido por peso e tempo estimado

--//OPERACOES COM JUNCOES
--//Filtrar os pedidos de um determinado entregador  por peso e tempo estimado (ordenado por data).
--app.post('/filterPesoTempo', urlencodedParser, ControllerCliente.pesotempo);


SELECT   Package_Size
        ,Package_Estimated_Time
FROM Delivery
        LEFT JOIN
    Package ON Delivery.Package_ID = Package.Package_ID
WHERE 
    User_Delivery_CPF = 222222222222
ORDER BY Package_Create_Date_Delivery


--//CROSS JOIN ENTREGADOR E VEICULO
-- lista com todos os pedidos e o veículo utilizado  - filtrado por entregador 
--app.post('/filterEntregadorVeiculo', urlencodedParser, ControllerCliente.entregadorveiculo);


SELECT   Package_ID
        ,Vehicle_ID
FROM Delivery
WHERE   
    User_Delivery_CPF = 222222222222


--//CROSS JOIN CLIENTE E PEDIDO
--lista de todos os pedidos feitos por um determinado cliente (o filtro aqui é o cliente).
--app.post('/filterClientePedido', urlencodedParser, ControllerCliente.clientepedido);

SELECT  Delivery.Package_ID,
        Package_Origin,
        Package_Destiny,
        Package_Price,
        Package_Description,
        Package_Estimated_Time,
        Package_Size,
        Package_Create_Date_Delivery 
FROM Delivery
        INNER JOIN 
    Package ON Delivery.Package_ID = Package.Package_ID
WHERE   
    User_Destiny_CPF = 11111111111

    
    
    
    