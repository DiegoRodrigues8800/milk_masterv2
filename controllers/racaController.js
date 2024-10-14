const Raca = require('../models/raca');
const { validationResult, body } = require('express-validator');

// Exibir a página de cadastro de raça
exports.exibirCadastro = async (req, res) => {
    try {
        res.render('cadastrarRaca', { erros: null, dados: {}, mensagemSucesso: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar página.');
    }
};

// Processar cadastro de raça
exports.cadastrarRaca = [
    body('nome').notEmpty().withMessage('Nome é obrigatório.').trim(),

    async (req, res) => {
        const erros = validationResult(req);
        const { nome } = req.body;
        const io = req.app.locals.io; // Acessa o objeto io

        if (!erros.isEmpty()) {
            const errosArray = erros.array();
            if (req.headers['content-type'] === 'application/json' || req.xhr) {
                // Emitir notificações para cada erro
                errosArray.forEach(erro => {
                    io.emit('notification', {
                        message: erro.msg,
                        type: 'danger'
                    });
                });
                return res.status(400).json({ erros: errosArray, dados: req.body, sucesso: false });
            }
            return res.render('cadastrarRaca', { erros: errosArray, dados: req.body, mensagemSucesso: null });
        }

        try {
            const racaExistente = await Raca.findOne({ where: { nome: nome.trim() } });
            if (racaExistente) {
                const erro = [{ msg: 'Raça já existente.' }];
                if (req.headers['content-type'] === 'application/json' || req.xhr) {
                    io.emit('notification', {
                        message: 'Raça já existente.',
                        type: 'danger'
                    });
                    return res.status(400).json({ erros: erro, dados: req.body, sucesso: false });
                }
                return res.render('cadastrarRaca', { erros: erro, dados: req.body, mensagemSucesso: null });
            }

            await Raca.create({ nome: nome.trim() });

            if (req.headers['content-type'] === 'application/json' || req.xhr) {
                io.emit('notification', {
                    message: 'Raça cadastrada com sucesso!',
                    type: 'success'
                });
                return res.status(201).json({ mensagem: 'Raça cadastrada com sucesso!', sucesso: true });
            }
            return res.render('cadastrarRaca', { erros: null, dados: {}, mensagemSucesso: 'Raça cadastrada com sucesso!' });
        } catch (error) {
            console.error(error);
            if (req.headers['content-type'] === 'application/json' || req.xhr) {
                io.emit('notification', {
                    message: 'Erro ao cadastrar raça: ' + error.message,
                    type: 'danger'
                });
                return res.status(500).json({ mensagem: 'Erro ao cadastrar raça.', sucesso: false });
            }
            return res.status(500).send('Erro ao cadastrar raça.');
        }
    }
];
