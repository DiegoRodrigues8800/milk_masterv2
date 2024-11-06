const { validationResult, body } = require('express-validator');

exports.exibirCadastro = async (req, res) => {
    try {
        res.render('financeiro', { erros: null, dados: {}, mensagemSucesso: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar página.');
    }
};