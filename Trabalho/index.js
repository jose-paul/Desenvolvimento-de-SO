const express = require('express');
//const {check, validationResult} = require('express-validator');

const app = express();

app.use(express.json());

//middleware
app.set('view engine', 'ejs');
const urlencodedParser = express.urlencoded({extended: false});
app.use(urlencodedParser);

const ControllerCliente = require('./controller/ControllerCliente');

//INSERE DADOS NO BANCO
app.post('/cadastro', urlencodedParser, ControllerCliente.insert);
app.post('/cadastroEntregador', urlencodedParser, ControllerCliente.insertEntregador);
app.post('/pedido', urlencodedParser, ControllerCliente.insertPedido);

//FAZ LOGIN DO CLIENTE
app.post('/login', ControllerCliente.login);

//OPERACOES SEM JUNCOES
app.put('/update/:id', ControllerCliente.update);
app.get('/usuarios', ControllerCliente.findAll);
app.get('/usuario/:id', ControllerCliente.findById);
app.delete('/usuario/:id', ControllerCliente.delete);

//OPERACOES COM JUNCOES
//Filtrar pedido por peso e tempo estimado
app.post('/filterPesoTempo', urlencodedParser, ControllerCliente.pesotempo);
//CROSS JOIN ENTREGADOR E VEICULO
app.post('/filterEntregadorVeiculo', urlencodedParser, ControllerCliente.entregadorveiculo);
//CROSS JOIN CLIENTE E PEDIDO
app.post('/filterClientePedido', urlencodedParser, ControllerCliente.clientepedido);

app.get('/' , (req, res) => {
    res.render('../views/app');
});

app.get('/cadastro', (req, res) => {
    res.render('registro');
});

app.get('/registroCliente', (req, res) => {
    res.render('registroCliente');
});

app.get('/registroEntregador', (req, res) => {
    res.render('registroEntregador');
});

app.get('/dashCliente/:id' , (req, res) => {
    //let user = await db.query('SELECT Nome FROM cliente WHERE IDCliente=?;', req.params.id);
    res.render('../views/dashboardCliente', {data: req.params.id});
});

app.get('/Pedido' , (req, res) => {
    res.render('../views/Pedido');
});

app.get('/dashEntregador/:id' , (req, res) => {
    res.render('../views/dashboardEntregador');
});

app.get('/PedidosEntregador' , (req, res) => {
    res.render('../views/PedidosEntregador');
});

app.get('/PedidosDisponiveis' , (req, res) => {
    res.render('../views/pedidosDisponiveis');
});

app.get('/Erro' , (req, res) => {
    res.render('../views/error');
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
    console.log(`API RODANDO PORTA ${PORT}`);
});