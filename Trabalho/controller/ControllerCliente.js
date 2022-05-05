const db = require('../config/db');

module.exports = {
    async insert(req, res){
        let datas = {
            "nome": req.body.inputNome,
            "email": req.body.inputEmail,
            "senha": req.body.inputSenha,
            "cartao": req.body.inputCartao,
            "phone": req.body.inputPhone
        }
        console.log("INFO: " + datas.nome + ", "+ datas.email +  ", " + datas.senha +  ", " + datas.cartao);

        try{
            const sql = 'INSERT INTO cliente(Nome, Email, Senha, Cartao, NumeroTelefone) VALUES (?,?,?,?,?)'
            values = [datas.nome, datas.email, datas.senha, datas.cartao, datas.phone];

            await db.query(sql, values);
            res.redirect(302, '/');
        } catch(error){
            console.log(error);
            res.redirect(302, '/Erro');
        }

        res.render('dashboardCliente');

    },
    async insertEntregador(req, res){
        let datas = {
            "nome": req.body.inputNome,
            "email": req.body.inputEmail,
            "numeroTelefone": req.body.inputPhone,
            "senha": req.body.inputSenha,
            "cpf": req.body.inputCPF,
            "pix": req.body.inputPix,
            "veiculo": req.body.inputVeiculo
        }

        console.log("INFO: " + datas.nome + ", "+ datas.email +  ", " + +
         datas.numeroTelefone +  ", " +
         datas.senha +  ", " +
         datas.cpf +  ", " +
         datas.pix +  ", " +
         datas.veiculo);

        try{
            const sql = 'INSERT INTO entregador(Nome, Email, NumeroTelefone, Senha, CPF, Pix) VALUES (?,?,?,?,?,?)'
            values = [datas.nome, datas.email, datas.numeroTelefone, datas.senha, datas.cpf, datas.pix];

            await db.query(sql, values);

            //insere na tabela veiculos tambem
            const lastID = await db.query('SELECT LAST_INSERT_ID();');
            console.log(lastID[0]);

            /* TO LISTS
            for (let [key, value] of Object.entries(lastID[0][0])) {
                console.log(`${key}: ${value}`);
              }
            */

            const sql3 = 'INSERT INTO veiculo(idEntregador, TipoVeiculo) VALUES (?,?)'
            values3 = [Object.entries(lastID[0][0])[0][1] ,datas.veiculo];
            await db.query(sql3, values3);

            res.redirect(302, '/');
        } catch(error){
            console.log(error);
            res.redirect(302, '/Erro');
        }

        res.render('/');

    },
    async insertPedido(req, res){
        let datas = {
            "nome": req.body.inputNome,
            "peso": req.body.inputPeso,
            "descricao": req.body.inputDesc,
            "origem": req.body.inputOrigem,
            "destino": req.body.inputDestino,
            "idCliente": 0,//req.body.inputEmail,
            "localizacaoEntr": "Gomes carneiro, 1, centro",
            "tempoEstimado": Math.floor(Math.random() * 6) + 1 + " horas",
            "preco": Math.floor(Math.random() * 200) + 15 + " R$",
        }
        console.log("INFO: " + datas.nome + ", "+
         datas.peso +  ", " + +
         datas.descricao +  ", " +
         datas.origem +  ", " +
         datas.destino +  ", " +
         datas.idCliente +  ", " +
         datas.localizacaoEntr +  ", " +
         datas.tempoEstimado);

        try{
            const sql = 'INSERT INTO pedido(idCliente, Origem, Destino, Preco, Peso, Descricao, Titulo, LocalizacaoEntregador, TempoEstimado, outroUsuario) VALUES (?,?,?,?,?,?,?,?,?,?)'
            values = [datas.idCliente, datas.origem, datas.destino, datas.preco, datas.peso, datas.descricao, datas.nome, datas.localizacaoEntr, datas.tempoEstimado, datas.email];

            await db.query(sql, values);
            res.redirect(302, '/dashCliente');
        } catch(error){
            console.log(error);
            res.redirect(302, '/Erro');
        }

        res.render('/');

    },
    async login(req, res){
        //let id = req.params.id;

        let datas = {
            "email": req.body.inputEmail,
            "senha": req.body.inputSenha
        }
        console.log("INFO: " + datas.email + ", "+ datas.senha);

        try{
            let sql = 'SELECT * FROM cliente WHERE Email=? AND Senha=?;';
            let response = await db.query(sql, [datas.email, datas.senha]);
            //res.json(response[0]);

            //console.log(response[0] + ", " + response[0].length);

            if(response[0].length != 0){
                console.log("LOGIN FEITO COM SUCESSO!");

                //busca o id do login
                let user = await db.query('SELECT IDCliente FROM cliente WHERE Email=?;', datas.email);
                //console.log(user[0] + ", " + Object.entries(user[0][0])[0][1]);

                //307 para post
                res.redirect(302, "/dashCliente/" + Object.entries(user[0][0])[0][1]);
            } else{
                console.log("Email ou senha errados!");
                res.redirect(302, '/Erro');
            }
        } catch(error){
            console.log(error);
            res.redirect(302, '/Erro');
        }
    },
    async update (req, res){
        let id = req.params.id;

        let datas = {
            "nome": req.body.inputNome,
            "email": req.body.inputEmail,
            "senha": req.body.inputSenha,
            "cartao": req.body.inputCartao
        }

        try{
            const sql = 'UPDATE IGNORE cliente SET Nome=?, IDCliente=?;';
            let response = await db.query(sql, [datas, id]);

            res.json(response);
        } catch(error){
            console.log(error);
            res.redirect(302, '/Erro');
        }
    },
    async findAll(req, res){
        try {
            let sql = 'SELECT * FROM cliente;';
            let response = await db.query(sql);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
            res.redirect(302, '/Erro');
        }
    },
    async findById(req, res){
        let id = req.params.id;

        try {
            let sql = 'SELECT * FROM cliente WHERE IDCliente=?;';
            let response = await db.query(sql, id);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
            res.redirect(302, '/Erro');
        }
    },
    async delete(req,res){
        let id = req.params.id;

        try {
            let sql = 'DELETE FROM cliente where IDCliente=?;';
            let response = await db.query(sql, id);
            res.json(response);
        } catch (error) {
            console.log(error);
            res.redirect(302, '/Erro');
        }
    },
    async clientepedido(req, res){


        try {
            let sql = 'SELECT idPedido, Titulo FROM pedido CROSS JOIN cliente';
            let response = await db.query(sql);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
            res.redirect(302, '/Erro');
        }
    },
    async pesotempo(req, res){
        let datas = {
            "peso": req.body.Peso,
            "tempo": req.body.TempoEstimado
        }

        try {
            let sql = 'SELECT * FROM pedido WHERE Peso=? AND TempoEstimado=?;';
            let response = await db.query(sql, [datas.peso, datas.tempo]);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
            res.redirect(302, '/Erro');
        }
    },
    async entregadorveiculo(req, res){
        try {
            let sql = 'SELECT idVeiculo, TipoVeiculo FROM veiculo CROSS JOIN entregador';
            let response = await db.query(sql);
            res.json(response[0]);
        } catch (error) {
            console.log(error);
            res.redirect(302, '/Erro');
        }
    }

}