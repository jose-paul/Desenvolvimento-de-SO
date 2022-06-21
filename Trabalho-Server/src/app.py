from typing import List

from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import create_engine
from starlette.responses import RedirectResponse

app = FastAPI(
    title="Trabalho-DS",
)

engine = create_engine(
    "postgresql://admin:qwerty@localhost:5432/trabalho_ds",
)


class CreditCard(BaseModel):
    number: int
    cvv: int
    owner: str
    expires: int


class Cliente(BaseModel):
    cpf: int
    name: str
    email: str
    password: str
    phone: str
    credit_card_id: int | None = None


class Veiculo(BaseModel):
    vehicle_id: int
    vehicle_type: str


class Entregador(Cliente):
    cpf: int
    pix_key: str


# User_Package

# Entrega


class Entrega(BaseModel):
    vehicle_id: int
    client_id: int
    delivery_id: int
    package_id: int


class Pacote(BaseModel):
    package_id: int
    origin: str
    destiny: str
    price: float
    description: str
    estimated_time: int
    size: float
    create_date_delivery: int


def get_exception_error(exception: Exception) -> JSONResponse:
    return JSONResponse(
        content=str(exception),
        status_code=status.HTTP_409_CONFLICT,
    )


def get_sequence(base: BaseModel) -> List:
    values = base.dict().values()
    sequence = []
    for value in values:
        sequence.append(value)
    return sequence


# Redirect root to docs
@app.get("/", include_in_schema=False)
async def redirect():
    return RedirectResponse(url=app.docs_url)


# insert
@app.post("/user/client")
async def create_user_account(cliente: Cliente) -> None:
    with engine.connect() as con:
        try:
            query = """
                INSERT INTO 
                    User_Account(CPF, Account_Name, Account_Email, Account_Pass, Account_Phone, Credit_Card_ID)
                VALUES
                    (%s, %s, %s, %s, %s, %s)
            """
            con.execute(query, get_sequence(cliente))
        except Exception as exception:
            return get_exception_error(exception)
        return cliente


# insertEntregador
@app.post("/user/delivery")
async def create_user_deliver(entregador: Entregador) -> None:
    with engine.connect() as con:
        try:
            query = """
                INSERT INTO
                    User_Account(CPF, Account_Name, Account_Email, Account_Pass, Account_Phone, Credit_Card_ID)
                VALUES
                    (%s, %s, %s, %s, %s, %s)
            """
            con.execute(query, get_sequence(entregador))
            query = """
                INSERT INTO
                    User_Deliver(Account_CPF, Deliver_Pix)
                VALUES
                    (%s, %s)
            """
            con.execute(query, [str(entregador.cpf), str(entregador.pix_key)])

        except Exception as exception:
            return get_exception_error(exception)
        return chave_pix


@app.post("/user/credit_card")
async def add_client_creadit_card(cartao: CreditCard) -> None:
    with engine.connect() as con:
        try:
            query = """
                INSERT INTO
                    Credit_Card(Card_Number, Card_CVV, Card_Owner, Card_Expires)
                VALUES
                    (%s, %s, %s, %s)
            """
            con.execute(query, get_sequence(cartao))
        except Exception as exception:
            return get_exception_error(exception)
        return cartao


@app.post("/user/client/card")
async def update_user_client_credit_card(user_cpf: int, credit_card_id: int):
    with engine.connect() as con:
        try:
            query = """
                UPDATE User_Account
                SET Credit_Card_ID = %s
                WHERE CPF = %s

            """
            con.execute(query, [str(credit_card_id), str(user_cpf)])

        except Exception as exception:
            return get_exception_error(exception)
        return credit_card_id


# app.include_router(authenticate.router)
# app.include_router(user.router)
