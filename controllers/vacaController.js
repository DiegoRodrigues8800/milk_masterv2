// controllers/VacaController.js
const Vaca = require('../models/vaca');
const Raca = require('../models/raca');
const { Sequelize } = require('sequelize');
const Estado = require('../models/estado');
const { validationResult, body } = require('express-validator');

// Exibir lista de vacas
exports.listarVacas = async (req, res) => {
    try {
        const vacas = await Vaca.findAll({
            include: [
                { model: Raca }, { model: Estado },
            ]
        });
        res.render('listarVaca', { vacas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao listar vacas.');
    }
};

// Exibir formulário de cadastro
exports.exibirFormularioCadastro = async (req, res) => {
    try {
        const racas = await Raca.findAll();
        const estados = await Estado.findAll();
        res.render('cadastrarVaca', { racas, estados, erros: null, dados: {}, mensagemSucesso: null });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar formulário.');
    }
};

exports.contarVacasPorEstado = async (req, res) => {
    try {
        console.log("Método contarVacasPorEstado foi chamado");

        const contagem = await Vaca.findAll({
            attributes: [
                'cod_estado',
                [Sequelize.fn('COUNT', Sequelize.col('idvaca')), 'total']
            ],
            group: ['cod_estado']
        });

        console.log("Contagem de vacas por estado:", contagem);
        res.json(contagem); // Retorna a contagem como JSON
    } catch (err) {
        console.error("Erro ao contar vacas por estado:", err.message); // Loga apenas a mensagem do erro
        console.error(err); // Loga o objeto de erro completo
        res.status(500).json({ error: 'Erro ao contar vacas por estado' });
    }
};


// Exibir página de configuração
exports.exibirConfig = async (req, res) => {
    try {
        res.render('config');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar página.');
    }
};

// Processar cadastro de vaca com notificações
exports.cadastrarVaca = [
    // Middlewares de validação
    body('nome').notEmpty().withMessage('Nome é obrigatório.').trim(),
    body('idade').isInt({ min: 0 }).withMessage('Idade deve ser um número válido.'),
    body('cod_raca').isInt({ min: 1 }).withMessage('Raça é obrigatória.'),
    body('cod_estado').isInt({ min: 1 }).withMessage('Estado é obrigatório.'),

    // Função de processamento
    async (req, res) => {
        const erros = validationResult(req);
        const { nome, idade, cod_raca, cod_estado } = req.body;
        const io = req.app.locals.io; // Acessa o objeto io para notificações

        if (!erros.isEmpty()) {
            const errosArray = erros.array();

            // Emitir notificações para cada erro
            errosArray.forEach(erro => {
                io.emit('notification', {
                    message: erro.msg,
                    type: 'danger'
                });
            });

            try {
                const racas = await Raca.findAll();
                const estados = await Estado.findAll();
                return res.render('cadastrarVaca', {
                    racas,
                    estados,
                    erros: errosArray,
                    dados: req.body,
                    mensagemSucesso: null
                });
            } catch (error) {
                console.error(error);
                return res.status(500).send('Erro ao carregar dados para o formulário.');
            }
        }

        try {
            const racaExistente = await Raca.findByPk(cod_raca);
            if (!racaExistente) {
                const erro = { msg: 'Raça selecionada não existe.' };
                io.emit('notification', {
                    message: erro.msg,
                    type: 'danger'
                });
                const racas = await Raca.findAll();
                const estados = await Estado.findAll();
                return res.render('cadastrarVaca', {
                    racas,
                    estados,
                    erros: [erro],
                    dados: req.body,
                    mensagemSucesso: null
                });
            }

            const estadoExistente = await Estado.findByPk(cod_estado);
            if (!estadoExistente) {
                const erro = { msg: 'Estado selecionado não existe.' };
                io.emit('notification', {
                    message: erro.msg,
                    type: 'danger'
                });
                const racas = await Raca.findAll();
                const estados = await Estado.findAll();
                return res.render('cadastrarVaca', {
                    racas,
                    estados,
                    erros: [erro],
                    dados: req.body,
                    mensagemSucesso: null
                });
            }

            await Vaca.create({ nome: nome.trim(), idade, cod_raca, cod_estado });

            // Emitir notificação de sucesso
            io.emit('notification', {
                message: 'Vaca cadastrada com sucesso!',
                type: 'success'
            });

            const racas = await Raca.findAll();
            const estados = await Estado.findAll();
        } catch (error) {
            console.error(error);
            io.emit('notification', {
                message: 'Erro ao cadastrar vaca: ' + error.message,
                type: 'danger'
            });
            return res.status(500).send('Erro ao cadastrar vaca.');
        }
    }
];

// Excluir vaca com notificações
exports.excluirVaca = async (req, res) => {
    const { idvaca } = req.params;
    const io = req.app.locals.io; // Acessa o objeto io para notificações

    try {
        const vaca = await Vaca.findByPk(idvaca);
        if (!vaca) {
            io.emit('notification', {
                message: 'Vaca não encontrada.',
                type: 'danger'
            });
            return res.status(404).send('Vaca não encontrada.');
        }

        await Vaca.destroy({ where: { idvaca } });

        // Emitir notificação de sucesso na exclusão
        io.emit('notification', {
            message: 'Vaca excluída com sucesso!',
            type: 'success'
        });
    } catch (error) {
        console.error(error);
        io.emit('notification', {
            message: 'Erro ao excluir vaca: ' + error.message,
            type: 'danger'
        });
        res.status(500).send('Erro ao excluir vaca.');
    }
};
